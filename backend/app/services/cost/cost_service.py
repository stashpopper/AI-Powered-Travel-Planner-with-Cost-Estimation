from __future__ import annotations

import asyncio
import os

import httpx
from langchain.chat_models import init_chat_model
from langchain_core.language_models import BaseChatModel
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field, ValidationError

from app.schemas.travel import CostBreakdown, TravelPlan


DEFAULT_DISTANCE_KM = 100.0
DEFAULT_FOOD_PER_DAY = 500
DEFAULT_HOTEL_PER_NIGHT = 1500
DEFAULT_PER_KM_RATE = 20.0
DEFAULT_MISC_PER_DAY = 200


class CityCostEstimate(BaseModel):
    """Structured LLM output for city-level hotel and food estimates."""

    hotel_per_night: float = Field(ge=0)
    food_per_day: float = Field(ge=0)


class CostService:
    """Compute cost using routing, geocoding, and resilient LLM city estimates."""

    def __init__(self, llm: BaseChatModel | None = None) -> None:
        """Initialize caches, transport settings, and the shared Mistral model."""
        self.geo_cache: dict[str, tuple[float, float]] = {}
        self.city_cost_cache: dict[str, dict[str, int]] = {}
        self.llm = llm or init_chat_model(
            model="mistral-small-latest",
            model_provider="mistralai",
            temperature=0.3,
            api_key=os.getenv("MISTRAL_API_KEY"),
        )
        self._headers = {
            "User-Agent": "AI-Travel-Planner/1.0 (+https://localhost)",
        }
        self._timeout = httpx.Timeout(15.0)
        self._city_cost_prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You estimate realistic travel costs for a city. "
                    "Assume a mid-range traveler unless specified otherwise. "
                    "Return only JSON with numeric keys hotel_per_night and food_per_day. "
                    "No markdown, no explanation, no extra text.",
                ),
                (
                    "human",
                    "Estimate average travel costs for a tourist in {city}.\n\n"
                    "Return JSON:\n"
                    "{{\n"
                    '  "hotel_per_night": ...,\n'
                    '  "food_per_day": ...\n'
                    "}}\n\n"
                    "Rules:\n"
                    "- hotel_per_night = average mid-range hotel\n"
                    "- food_per_day = 2 meals + snacks\n"
                    "- use realistic current prices\n"
                    "- output ONLY JSON",
                ),
            ]
        )

    async def compute_cost(self, plan: TravelPlan) -> CostBreakdown:
        """Compute a validated cost breakdown without ever raising outward errors."""
        day_count = len(plan.days)
        if day_count <= 0:
            return self._build_cost_breakdown(transport=0, stay=0, food=0, day_count=0)

        route_locations = self._extract_route_locations(plan)
        route_edges = self._build_route_edges(route_locations)
        unique_cities = self._extract_unique_cities(plan)

        total_distance_km = self._fallback_total_distance(len(route_edges))
        city_costs = {city: self._default_city_costs() for city in unique_cities}

        try:
            async with httpx.AsyncClient(
                headers=self._headers,
                timeout=self._timeout,
                follow_redirects=True,
            ) as client:
                _, city_costs = await asyncio.gather(
                    self._ensure_coordinates(route_locations, client),
                    self._estimate_city_costs_for_cities(unique_cities),
                )
                total_distance_km = await self._calculate_total_distance_km(route_edges, client)
        except Exception:
            total_distance_km = self._fallback_total_distance(len(route_edges))
            city_costs = {city: self._default_city_costs() for city in unique_cities}

        transport = max(int(round(total_distance_km * DEFAULT_PER_KM_RATE)), 0)
        stay = self._calculate_stay_cost(plan, city_costs)
        food = self._calculate_food_cost(plan, city_costs)

        return self._build_cost_breakdown(
            transport=transport,
            stay=stay,
            food=food,
            day_count=day_count,
        )

    async def estimate_city_costs(self, city: str) -> dict[str, int]:
        """Estimate hotel and food costs for a city using structured LLM output."""
        normalized_city = city.strip()
        if not normalized_city:
            return self._default_city_costs()

        cached_costs = self.city_cost_cache.get(normalized_city)
        if cached_costs is not None:
            return cached_costs

        try:
            structured_llm = self.llm.with_structured_output(CityCostEstimate)
            chain = self._city_cost_prompt | structured_llm
            result = await chain.ainvoke({"city": normalized_city})
            validated = CityCostEstimate.model_validate(result)
            estimated_costs = {
                "hotel_per_night": max(int(round(validated.hotel_per_night)), DEFAULT_HOTEL_PER_NIGHT),
                "food_per_day": max(int(round(validated.food_per_day)), DEFAULT_FOOD_PER_DAY),
            }
        except (ValidationError, Exception):
            estimated_costs = self._default_city_costs()

        self.city_cost_cache[normalized_city] = estimated_costs
        return estimated_costs

    def _extract_route_locations(self, plan: TravelPlan) -> list[dict[str, float | str | None]]:
        """Build an ordered location list with consecutive duplicates removed."""
        route_locations: list[dict[str, float | str | None]] = []

        for day in plan.days:
            location = day.location.strip()
            if route_locations and route_locations[-1]["location"] == location:
                continue

            route_locations.append(
                {
                    "location": location,
                    "lat": day.lat,
                    "lon": day.lon,
                }
            )

        return route_locations

    def _extract_unique_cities(self, plan: TravelPlan) -> list[str]:
        """Collect unique location names in first-seen order for LLM estimation."""
        unique_cities: list[str] = []
        seen: set[str] = set()

        for day in plan.days:
            city = day.location.strip()
            if not city or city in seen:
                continue
            seen.add(city)
            unique_cities.append(city)

        return unique_cities

    async def _ensure_coordinates(
        self,
        route_locations: list[dict[str, float | str | None]],
        client: httpx.AsyncClient,
    ) -> None:
        """Populate missing coordinates from cache or Nominatim."""
        pending_entries: list[dict[str, float | str | None]] = []
        tasks: list[asyncio.Task[tuple[float, float] | None]] = []

        for entry in route_locations:
            location = str(entry["location"])
            lat = entry.get("lat")
            lon = entry.get("lon")

            if isinstance(lat, (float, int)) and isinstance(lon, (float, int)):
                coordinates = (float(lat), float(lon))
                entry["lat"], entry["lon"] = coordinates
                self.geo_cache[location] = coordinates
                continue

            cached_coordinates = self.geo_cache.get(location)
            if cached_coordinates is not None:
                entry["lat"], entry["lon"] = cached_coordinates
                continue

            pending_entries.append(entry)
            tasks.append(asyncio.create_task(self._geocode_location(location, client)))

        if not tasks:
            return

        results = await asyncio.gather(*tasks, return_exceptions=True)
        for entry, result in zip(pending_entries, results):
            if isinstance(result, Exception) or result is None:
                continue
            entry["lat"], entry["lon"] = result
            self.geo_cache[str(entry["location"])] = result

    async def _geocode_location(
        self,
        location: str,
        client: httpx.AsyncClient,
    ) -> tuple[float, float] | None:
        """Resolve a location into latitude and longitude via Nominatim."""
        try:
            response = await client.get(
                "https://nominatim.openstreetmap.org/search",
                params={
                    "q": location,
                    "format": "json",
                    "limit": 1,
                },
            )
            response.raise_for_status()
            payload = response.json()
        except (httpx.HTTPError, ValueError):
            return None

        if not isinstance(payload, list) or not payload:
            return None

        first_result = payload[0]
        if not isinstance(first_result, dict):
            return None

        try:
            return float(first_result["lat"]), float(first_result["lon"])
        except (KeyError, TypeError, ValueError):
            return None

    def _build_route_edges(
        self,
        route_locations: list[dict[str, float | str | None]],
    ) -> list[
        tuple[
            dict[str, float | str | None],
            dict[str, float | str | None],
        ]
    ]:
        """Convert ordered locations into adjacent graph edges."""
        return list(zip(route_locations, route_locations[1:]))

    async def _calculate_total_distance_km(
        self,
        route_edges: list[
            tuple[
                dict[str, float | str | None],
                dict[str, float | str | None],
            ]
        ],
        client: httpx.AsyncClient,
    ) -> float:
        """Compute total route distance across all edges using OSRM."""
        if not route_edges:
            return 0.0

        results = await asyncio.gather(
            *(self._fetch_route_distance_km(start, end, client) for start, end in route_edges),
            return_exceptions=True,
        )

        total_distance_km = 0.0
        for result in results:
            if isinstance(result, Exception):
                total_distance_km += DEFAULT_DISTANCE_KM
            else:
                total_distance_km += result

        return total_distance_km

    async def _fetch_route_distance_km(
        self,
        start: dict[str, float | str | None],
        end: dict[str, float | str | None],
        client: httpx.AsyncClient,
    ) -> float:
        """Fetch driving distance between two points from OSRM."""
        start_lat = start.get("lat")
        start_lon = start.get("lon")
        end_lat = end.get("lat")
        end_lon = end.get("lon")

        if not all(isinstance(value, (float, int)) for value in (start_lat, start_lon, end_lat, end_lon)):
            return DEFAULT_DISTANCE_KM

        try:
            response = await client.get(
                "http://router.project-osrm.org/route/v1/driving/"
                f"{float(start_lon)},{float(start_lat)};{float(end_lon)},{float(end_lat)}",
                params={"overview": "false"},
            )
            response.raise_for_status()
            payload = response.json()
            routes = payload.get("routes")
            if not isinstance(routes, list) or not routes:
                return DEFAULT_DISTANCE_KM

            distance_meters = routes[0].get("distance")
            if not isinstance(distance_meters, (float, int)):
                return DEFAULT_DISTANCE_KM

            return max(distance_meters / 1000.0, 0.0)
        except (httpx.HTTPError, TypeError, ValueError, KeyError):
            return DEFAULT_DISTANCE_KM

    async def _estimate_city_costs_for_cities(self, cities: list[str]) -> dict[str, dict[str, int]]:
        """Estimate city costs once per unique location in parallel."""
        if not cities:
            return {}

        results = await asyncio.gather(
            *(self.estimate_city_costs(city) for city in cities),
            return_exceptions=True,
        )

        estimated_costs: dict[str, dict[str, int]] = {}
        for city, result in zip(cities, results):
            if isinstance(result, Exception):
                estimated_costs[city] = self._default_city_costs()
            else:
                estimated_costs[city] = result

        return estimated_costs

    def _calculate_food_cost(
        self,
        plan: TravelPlan,
        city_costs: dict[str, dict[str, int]],
    ) -> int:
        """Calculate total food cost across itinerary days."""
        total_food_cost = 0
        for day in plan.days:
            city = day.location.strip()
            total_food_cost += max(city_costs.get(city, self._default_city_costs())["food_per_day"], 0)
        return total_food_cost

    def _calculate_stay_cost(
        self,
        plan: TravelPlan,
        city_costs: dict[str, dict[str, int]],
    ) -> int:
        """Calculate total hotel cost for each overnight stay."""
        total_stay_cost = 0
        for day in plan.days[:-1]:
            city = day.location.strip()
            total_stay_cost += max(city_costs.get(city, self._default_city_costs())["hotel_per_night"], 0)
        return total_stay_cost

    def _default_city_costs(self) -> dict[str, int]:
        """Return the mandatory fallback city cost values."""
        return {
            "hotel_per_night": DEFAULT_HOTEL_PER_NIGHT,
            "food_per_day": DEFAULT_FOOD_PER_DAY,
        }

    def _fallback_total_distance(self, edge_count: int) -> float:
        """Return the safe route fallback when distance calls fail."""
        return float(max(edge_count, 0) * DEFAULT_DISTANCE_KM)

    def _build_cost_breakdown(
        self,
        transport: int,
        stay: int,
        food: int,
        day_count: int,
    ) -> CostBreakdown:
        """Aggregate all cost components into a validated schema object."""
        safe_transport = max(int(transport), 0)
        safe_stay = max(int(stay), 0)
        safe_food = max(int(food), 0)
        misc = max(DEFAULT_MISC_PER_DAY * day_count, 0)
        total = safe_transport + safe_stay + safe_food + misc

        return CostBreakdown(
            transport=safe_transport,
            stay=safe_stay,
            food=safe_food,
            misc=misc,
            total=total,
        )