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
            "CRITICAL: Do not repeat any location across different days within the same plan. Each day's location must be unique. "
            "CRITICAL: Across the three variants, never produce the same sequence of locations as another variant. "
            "Each variant must feel like a genuinely different trip with a different set of places. "
            "Prioritize diversity: select a varied set of places to maximize exploration value. "
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
                    "5. The plan must be valid as a TravelPlan object.\n"
                    "6. If the request includes a budget, ensure the total cost (transport + stay + food + misc) does not exceed it.\n"
                    "7. Populate lat and lon for each day from the allowed places data when available.\n\n"
                    "Additional constraints:\n{constraints}"
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

        # Give each variant a disjoint preferred subset so the first pass already
        # diverges. The LLM may still draw from the full list, but this nudges
        # the three plans toward different places.
        preferred_subsets = self._partition_places(normalized_places)

        generated_results = await asyncio.gather(
            *(
                self._generate_single_plan(
                    request=request,
                    places=normalized_places,
                    plan_variant=plan_variant,
                    variant_guidance=variant_guidance,
                    preferred_places=preferred_subset,
                )
                for (plan_variant, variant_guidance), preferred_subset in zip(
                    self._plan_variants, preferred_subsets
                )
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

        # Deterministically enforce that the three plans are not the same journey.
        plans = await self._enforce_cross_plan_diversity(
            request=request,
            plans=plans,
            all_places=normalized_places,
        )

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
        preferred_places: list[Place] | None = None,
        avoid_locations: list[str] | None = None,
        repeat_warning: bool = False,
    ) -> TravelPlan:
        """Generate one itinerary variant with a small retry budget for flaky LLM output."""
        last_error: Exception | None = None

        # Negative feedback for diversity retries: tell the model which locations
        # the other variants already used so it must pick a different set.
        avoid_text = ""
        if avoid_locations:
            avoid_text = (
                "\n\nIMPORTANT: The following locations are already used by other plan "
                f"variants and must NOT appear in this plan: {', '.join(avoid_locations)}. "
                "Choose a clearly different set of places."
            )

        repeat_text = ""
        if repeat_warning:
            repeat_text = (
                "\n\nCRITICAL: Your previous attempt repeated the same location across "
                "multiple days. Every day in this plan MUST use a unique location."
            )

        preferred_text = ""
        if preferred_places:
            preferred_text = (
                "\n\nPrefer this variant-specific subset of places to keep the plans distinct "
                "(you may still use any allowed place): "
                f"{', '.join(p.name for p in preferred_places)}."
            )

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
                        "constraints": preferred_text + avoid_text + repeat_text,
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

    def _partition_places(self, places: list[Place]) -> list[list[Place]]:
        """Split candidates into three disjoint preferred subsets by type/region.

        Groups places by (type, region) to keep geographically and thematically
        coherent subsets, then distributes groups round-robin across variants.
        Falls back to simple round-robin if all places share the same key.
        """
        from collections import defaultdict

        buckets: dict[tuple[str, str], list[Place]] = defaultdict(list)
        for place in places:
            key = (place.type.strip().lower(), place.region.strip().lower())
            buckets[key].append(place)

        # Sort buckets by size descending for balanced distribution
        sorted_buckets = sorted(buckets.values(), key=len, reverse=True)

        groups: list[list[Place]] = [[], [], []]
        if len(sorted_buckets) >= 2:
            # Distribute whole buckets to keep geographic coherence
            for idx, bucket in enumerate(sorted_buckets):
                groups[idx % len(groups)].extend(bucket)
        else:
            # All places share same type+region; fall back to round-robin
            for index, place in enumerate(places):
                groups[index % len(groups)].append(place)

        return groups

    def _min_diversity_days(self, days: int) -> int:
        """Minimum number of day-locations two plans must differ by."""
        return max(2, days // 2)

    @staticmethod
    def _location_sequence(plan: TravelPlan) -> tuple[str, ...]:
        """Ordered, normalized day-location sequence for a plan."""
        return tuple(day.location.strip().lower() for day in plan.days)

    @staticmethod
    def _sequence_difference(
        first: tuple[str, ...], second: tuple[str, ...]
    ) -> int:
        """Count of differing positions (plus length mismatch) between two plans."""
        zipped = sum(1 for a, b in zip(first, second) if a != b)
        return zipped + abs(len(first) - len(second))

    async def _enforce_cross_plan_diversity(
        self,
        request: TravelRequest,
        plans: list[TravelPlan],
        all_places: list[Place],
    ) -> list[TravelPlan]:
        """Ensure the three plans are not the same journey.

        If two plans are too similar, regenerate the worse one while telling the
        model which locations the other variants already used. Retries a few
        times; if divergence is still impossible (too few candidates), the
        best-effort result is returned rather than hard-failing.
        """
        if len(plans) < 2:
            return plans

        min_diff = self._min_diversity_days(request.days)

        for _ in range(3):
            sequences = [self._location_sequence(plan) for plan in plans]
            # idx -> (avoid_locations, repeat_warning)
            flagged: dict[int, tuple[set[str], bool]] = {}

            # 1) Flag plans that repeat a location within themselves.
            for i, seq in enumerate(sequences):
                if len(seq) != len(set(seq)):
                    flagged.setdefault(i, (set(), False))
                    flagged[i] = (flagged[i][0], True)

            # 2) Flag pairs that are too similar across plans.
            for i in range(len(plans)):
                for j in range(i + 1, len(plans)):
                    if self._sequence_difference(sequences[i], sequences[j]) < min_diff:
                        # Regenerate the less diverse plan, keeping the other.
                        keep = j if len(set(sequences[j])) >= len(set(sequences[i])) else i
                        regenerate_idx = i if keep == j else j
                        entry = flagged.get(regenerate_idx, (set(), False))
                        avoid = set(entry[0])
                        avoid.update(sequences[keep])
                        flagged[regenerate_idx] = (avoid, entry[1])

            if not flagged:
                break

            # Regenerate flagged plans one at a time, updating sequences after
            # each regeneration so subsequent checks use fresh data.
            for idx, (avoid, repeat_warning) in sorted(flagged.items()):
                try:
                    regenerated = await self._generate_single_plan(
                        request=request,
                        places=all_places,
                        plan_variant=self._plan_variants[idx][0],
                        variant_guidance=self._plan_variants[idx][1],
                        avoid_locations=sorted(avoid) or None,
                        repeat_warning=repeat_warning,
                    )
                    plans[idx] = regenerated
                    # Update this plan's sequence for subsequent pairwise checks
                    sequences[idx] = self._location_sequence(regenerated)
                except Exception:
                    # Keep the original plan if regeneration fails.
                    continue

        return plans

    def _validate_plans(
        self,
        request: TravelRequest,
        places: list[Place],
        plans: list[TravelPlan],
    ) -> list[TravelPlan]:
        """Enforce request constraints and return only valid plans."""
        allowed_locations = {place.name for place in places}
        location_aliases = self._build_allowed_location_aliases(places)
        # Build a lookup for lat/lon enrichment from candidate places
        place_coords: dict[str, tuple[float | None, float | None]] = {}
        for place in places:
            coords = (getattr(place, "lat", None), getattr(place, "lon", None))
            if coords != (None, None):
                place_coords[place.name] = coords

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
                # Enrich with coordinates from candidate places when available
                if resolved_location in place_coords:
                    lat, lon = place_coords[resolved_location]
                    if lat is not None and day.lat is None:
                        object.__setattr__(day, "lat", lat)
                    if lon is not None and day.lon is None:
                        object.__setattr__(day, "lon", lon)

            if len(validated_plan.days) != request.days:
                raise RuntimeError(
                    f"Plan '{validated_plan.title}' has {len(validated_plan.days)} days but request requires {request.days}"
                )

            if validated_plan.title in seen_titles:
                raise RuntimeError(f"Duplicate generated plan title: {validated_plan.title}")

            seen_locations: set[str] = set()
            for day in validated_plan.days:
                if day.location in seen_locations:
                    raise RuntimeError(
                        f"Plan '{validated_plan.title}' repeats location '{day.location}' across days"
                    )
                seen_locations.add(day.location)

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