import asyncio
import json
import os
import re
from collections import defaultdict

from langchain.chat_models import init_chat_model
from langchain_core.language_models import BaseChatModel
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, ValidationError

from app.schemas.travel import Place, TravelPlan, TravelRequest


class TravelPlanSet(BaseModel):
    """Legacy wrapper retained for compatibility with existing imports/tests."""

    budget_optimized: TravelPlan
    comfort_optimized: TravelPlan
    exploration_heavy: TravelPlan


class ItineraryService:
    """Generate multiple validated itinerary options from a request and candidate places."""

    _plan_variants = (
        (
            "Budget Optimized",
            "Prioritize lower spending, efficient routing, shared or lower-cost transport logic, and value-focused experiences.",
        ),
        (
            "Comfort Optimized",
            "Prioritize smoother pacing, convenience, less exhausting movement, and more comfortable day structure.",
        ),
        (
            "Exploration Heavy",
            "Prioritize variety, discovery, and broader coverage while still remaining realistic and geographically sensible.",
        ),
    )

    def __init__(self, llm: BaseChatModel | None = None) -> None:
        """Initialize the itinerary generator with an injectable chat model."""
        self.llm = llm or init_chat_model(
            model="mistral-small-latest",
            model_provider="mistralai",
            temperature=0.4,
            api_key=os.getenv("MISTRAL_API_KEY"),
        )
        self.prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are an expert travel planner that creates structured multi-day itineraries. "
                    "Generate exactly three meaningfully different plans: budget optimized, comfort optimized, and exploration heavy. "
                    "Every plan must be fully valid against the provided schema. "
                    "Use only locations from the allowed places list and never invent new locations, cities, or attractions. "
                    "The number of day entries must exactly match the requested number of days. "
                    "Day numbering must be sequential from 1 through N. "
                    "Each day must include a single location from the allowed list, a practical set of activities, and a rough travel_time_hours value. "
                    "Keep travel flow realistic by grouping nearby places logically and avoiding impossible jumps. "
                    "Make the three plans clearly distinct in pacing, cost profile, and coverage. "
                    "For costs, use non-negative integers and ensure total equals transport + stay + food + misc. "
                    "Return structured output only."
                ),
                (
                    "human",
                    "Create exactly one travel plan for this request.\n\n"
                    "Plan variant:\n{plan_variant}\n\n"
                    "Variant guidance:\n{variant_guidance}\n\n"
                    "Travel request:\n{request}\n\n"
                    "Allowed places:\n{places}\n\n"
                    "Requirements:\n"
                    "1. Consider user preferences carefully when selecting and distributing places across days.\n"
                    "2. Use only the allowed place names exactly as provided for day locations.\n"
                    "3. The number of day entries must exactly match request.days.\n"
                    "4. Titles should clearly reflect the requested plan variant.\n"
                    "5. The plan must be valid as a TravelPlan object."
                ),
            ]
        )

    async def generate_plans(
        self,
        request: TravelRequest,
        places: list[Place],
    ) -> list[TravelPlan]:
        """Generate and validate the three required travel plan variants."""
        normalized_places = self._normalize_places(places)
        if not normalized_places:
            raise RuntimeError("No candidate places were available for itinerary generation")

        generated_results = await asyncio.gather(
            *(
                self._generate_single_plan(
                    request=request,
                    places=normalized_places,
                    plan_variant=plan_variant,
                    variant_guidance=variant_guidance,
                )
                for plan_variant, variant_guidance in self._plan_variants
            ),
            return_exceptions=True,
        )

        plans: list[TravelPlan] = []
        errors: list[str] = []
        for (plan_variant, _), result in zip(self._plan_variants, generated_results):
            if isinstance(result, Exception):
                errors.append(f"{plan_variant}: {result}")
                continue
            plans.append(result)

        if errors:
            raise RuntimeError("; ".join(errors))

        return self._validate_plans(
            request=request,
            places=normalized_places,
            plans=plans,
        )

    async def _generate_single_plan(
        self,
        request: TravelRequest,
        places: list[Place],
        plan_variant: str,
        variant_guidance: str,
    ) -> TravelPlan:
        """Generate one itinerary variant with a small retry budget for flaky LLM output."""
        last_error: Exception | None = None

        for _ in range(2):
            try:
                structured_llm = self.llm.with_structured_output(TravelPlan)
                chain = self.prompt | structured_llm
                result = await chain.ainvoke(
                    {
                        "plan_variant": plan_variant,
                        "variant_guidance": variant_guidance,
                        "request": json.dumps(request.model_dump(), ensure_ascii=False, indent=2),
                        "places": json.dumps(
                            [place.model_dump() for place in places],
                            ensure_ascii=False,
                            indent=2,
                        ),
                    }
                )
                return TravelPlan.model_validate(result)
            except Exception as exc:
                last_error = exc

        raise RuntimeError(str(last_error) if last_error else f"Failed to generate {plan_variant} plan")

    def _normalize_places(self, places: list[Place]) -> list[Place]:
        """Deduplicate places while preserving order."""
        unique_places: list[Place] = []
        seen_names: set[str] = set()

        for place in places:
            cleaned_name = place.name.strip()
            if cleaned_name in seen_names:
                continue
            seen_names.add(cleaned_name)
            unique_places.append(place)

        return unique_places

    def _validate_plans(
        self,
        request: TravelRequest,
        places: list[Place],
        plans: list[TravelPlan],
    ) -> list[TravelPlan]:
        """Enforce request constraints and return only valid plans."""
        allowed_locations = {place.name for place in places}
        location_aliases = self._build_allowed_location_aliases(places)
        validated_plans: list[TravelPlan] = []
        seen_titles: set[str] = set()

        for plan in plans:
            try:
                validated_plan = TravelPlan.model_validate(plan)
            except ValidationError as exc:
                raise RuntimeError(f"Generated plan failed schema validation: {exc}") from exc

            validated_plan = validated_plan.model_copy(deep=True)
            for day in validated_plan.days:
                resolved_location = self._resolve_location_name(day.location, allowed_locations, location_aliases)
                object.__setattr__(day, "location", resolved_location)

            if len(validated_plan.days) != request.days:
                raise RuntimeError(
                    f"Plan '{validated_plan.title}' has {len(validated_plan.days)} days but request requires {request.days}"
                )

            if validated_plan.title in seen_titles:
                raise RuntimeError(f"Duplicate generated plan title: {validated_plan.title}")

            if any(day.location not in allowed_locations for day in validated_plan.days):
                invalid_locations = sorted(
                    {day.location for day in validated_plan.days if day.location not in allowed_locations}
                )
                raise RuntimeError(
                    f"Plan '{validated_plan.title}' used locations not present in extracted places: {invalid_locations}"
                )

            if any(day.travel_time_hours > 12 for day in validated_plan.days):
                raise RuntimeError(f"Plan '{validated_plan.title}' contains unrealistic travel_time_hours over 12")

            seen_titles.add(validated_plan.title)
            validated_plans.append(validated_plan)

        if len(validated_plans) < 3:
            raise RuntimeError(f"Only {len(validated_plans)} valid plans were generated; 3 are required")

        return validated_plans

    def _build_allowed_location_aliases(self, places: list[Place]) -> dict[str, str]:
        """Build a stable alias map so small LLM naming variations resolve to allowed places."""
        alias_candidates: dict[str, set[str]] = defaultdict(set)

        for place in places:
            for alias in self._generate_location_aliases(place.name):
                alias_candidates[alias].add(place.name)

        return {
            alias: next(iter(candidates))
            for alias, candidates in alias_candidates.items()
            if len(candidates) == 1
        }

    def _resolve_location_name(
        self,
        location: str,
        allowed_locations: set[str],
        location_aliases: dict[str, str],
    ) -> str:
        """Resolve a generated location back to the closest allowed canonical place name."""
        cleaned_location = location.strip()
        if cleaned_location in allowed_locations:
            return cleaned_location

        for alias in self._generate_location_aliases(cleaned_location):
            matched_location = location_aliases.get(alias)
            if matched_location:
                return matched_location

        return cleaned_location

    def _generate_location_aliases(self, location: str) -> set[str]:
        """Generate normalized aliases for destination names to absorb minor wording changes."""
        tokens = self._normalize_location_tokens(location)
        if not tokens:
            return set()

        aliases = {" ".join(tokens)}
        generic_geo_tokens = {
            "island",
            "islands",
            "beach",
            "city",
            "town",
            "village",
            "market",
            "monastery",
            "temple",
            "shrine",
            "park",
            "national",
            "lake",
            "mount",
            "mountain",
            "volcano",
            "river",
            "falls",
            "waterfall",
            "pass",
            "hill",
            "garden",
            "dam",
            "forest",
        }

        reduced_tokens = [token for token in tokens if token not in generic_geo_tokens]
        if reduced_tokens:
            aliases.add(" ".join(reduced_tokens))

        if len(tokens) > 1 and tokens[-1] in generic_geo_tokens:
            aliases.add(" ".join(tokens[:-1]))

        return {alias.strip() for alias in aliases if alias.strip()}

    def _normalize_location_tokens(self, location: str) -> list[str]:
        """Normalize a location string into comparable tokens."""
        cleaned = re.sub(r"[^a-z0-9\s]", " ", location.lower())
        raw_tokens = cleaned.split()
        token_map = {
            "mt": "mount",
            "st": "saint",
        }
        return [token_map.get(token, token) for token in raw_tokens if token]