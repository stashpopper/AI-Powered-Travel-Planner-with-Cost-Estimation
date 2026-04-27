from __future__ import annotations

import asyncio
import os

import httpx

from app.schemas.travel import TravelPlan


class ImageService:
    """Fetch and attach one representative image per itinerary location."""

    def __init__(self, api_key: str | None = None) -> None:
        """Initialize Pexels credentials, cache, and HTTP settings."""
        self.api_key = api_key or os.getenv("PEXELS_API_KEY")
        self.image_cache: dict[str, str] = {}
        self._timeout = httpx.Timeout(15.0)

    async def enrich_plans(self, plans: list[TravelPlan]) -> list[TravelPlan]:
        """Enrich each day in each plan with a cached Pexels image URL."""
        if not plans:
            return plans

        unique_locations = self._collect_unique_locations(plans)
        missing_locations = [location for location in unique_locations if location not in self.image_cache]

        if missing_locations and self.api_key:
            headers = {"Authorization": self.api_key}
            try:
                async with httpx.AsyncClient(timeout=self._timeout, headers=headers) as client:
                    results = await asyncio.gather(
                        *(self._fetch_image_url(client, location) for location in missing_locations),
                        return_exceptions=True,
                    )
            except Exception:
                results = [""] * len(missing_locations)

            for location, result in zip(missing_locations, results):
                self.image_cache[location] = result if isinstance(result, str) else ""

        for location in unique_locations:
            self.image_cache.setdefault(location, "")

        for plan in plans:
            for day in plan.days:
                object.__setattr__(day, "image_url", self.image_cache.get(day.location.strip(), ""))

        return plans

    def _collect_unique_locations(self, plans: list[TravelPlan]) -> list[str]:
        """Collect unique day locations in first-seen order."""
        unique_locations: list[str] = []
        seen: set[str] = set()

        for plan in plans:
            for day in plan.days:
                location = day.location.strip()
                if not location or location in seen:
                    continue
                seen.add(location)
                unique_locations.append(location)

        return unique_locations

    async def _fetch_image_url(self, client: httpx.AsyncClient, location: str) -> str:
        """Fetch a single medium-sized Pexels image URL for a location."""
        try:
            response = await client.get(
                "https://api.pexels.com/v1/search",
                params={"query": location, "per_page": 1},
            )
            response.raise_for_status()
            payload = response.json()
        except (httpx.HTTPError, ValueError):
            return ""

        photos = payload.get("photos")
        if not isinstance(photos, list) or not photos:
            return ""

        first_photo = photos[0]
        if not isinstance(first_photo, dict):
            return ""

        src = first_photo.get("src")
        if not isinstance(src, dict):
            return ""

        medium_url = src.get("medium")
        return medium_url.strip() if isinstance(medium_url, str) else ""