import asyncio
from typing import Any

from fastapi import APIRouter

from app.schemas.travel import (
    TravelPlan,
    TravelRequest,
)
from app.services.cost.cost_service import CostService
from app.services.media.image_service import ImageService
from app.services.planner.evaluation_service import EvaluationService
from app.services.planner.itinerary_service import ItineraryService
from app.services.planner.place_extractor import PlaceExtractor
from app.services.search.search_service import TravelSearchService


router = APIRouter()

search_service = TravelSearchService()
place_extractor = PlaceExtractor()
itinerary_service = ItineraryService()
cost_service = CostService()
evaluation_service = EvaluationService()
image_service = ImageService()


@router.post("/plan")
async def create_travel_plan(request: TravelRequest) -> dict[str, Any]:
    """Run the full travel planning pipeline and return ranked plan options."""
    try:
        query = _build_search_query(request)
        search_results = await search_service.search_places(query)
        if not search_results:
            return _error_response(
                stage="search",
                detail="Tavily returned no search results for the generated travel query.",
                query=query,
            )

        places = await place_extractor.extract_places(search_results)
        if not places:
            return _error_response(
                stage="place_extraction",
                detail="The place extractor could not extract any valid destinations from the search results.",
                query=query,
                search_results_count=len(search_results),
            )

        try:
            plans = await itinerary_service.generate_plans(request, places)
        except Exception as exc:
            return _error_response(
                stage="itinerary_generation",
                detail=str(exc),
                query=query,
                search_results_count=len(search_results),
                places_count=len(places),
                extracted_places=[place.name for place in places],
            )

        if not plans:
            return _error_response(
                stage="itinerary_generation",
                detail="No plans were generated.",
                query=query,
                places_count=len(places),
            )

        computed_costs = await asyncio.gather(
            *(cost_service.compute_cost(plan) for plan in plans),
            return_exceptions=True,
        )

        costed_plans: list[TravelPlan] = []
        for plan, computed_cost in zip(plans, computed_costs):
            if isinstance(computed_cost, Exception):
                costed_plans.append(plan)
                continue

            costed_plans.append(plan.model_copy(update={"cost": computed_cost}))

        evaluated_plans, recommended = evaluation_service.evaluate_plans(costed_plans)
        if not evaluated_plans or not recommended:
            raise ValueError("Plan evaluation failed")

        enriched_plans = await image_service.enrich_plans(evaluated_plans)
        return {
            "recommended_plan": recommended,
            "plans": [self_plan for self_plan in (_serialize_plan(plan) for plan in enriched_plans)],
        }
    except Exception as exc:
        return _error_response(stage="unexpected", detail=str(exc))


def _serialize_plan(plan: TravelPlan) -> dict[str, Any]:
    """Transform a full TravelPlan into a frontend-friendly response object."""
    places = _extract_unique_locations(plan)
    summary = plan.evaluation.best_for.strip() or plan.evaluation.tradeoffs.strip()
    day_count = max(len(plan.days), 1)
    stay_day_divisor = max(len(plan.days) - 1, 1)

    return {
        "title": plan.title,
        "total_cost": plan.cost.total,
        "currency": "INR",
        "days": len(plan.days),
        "summary": summary,
        "places": places,
        "cost_breakdown": {
            "currency": "INR",
            "total": plan.cost.total,
            "breakdown": {
                "travel": plan.cost.transport,
                "stay": plan.cost.stay,
                "food": plan.cost.food,
                "misc": plan.cost.misc,
            },
            "per_day": {
                "travel": round(plan.cost.transport / day_count),
                "stay": round(plan.cost.stay / stay_day_divisor),
                "food": round(plan.cost.food / day_count),
                "misc": round(plan.cost.misc / day_count),
            },
        },
        "daily_plan": [
            {
                "day": day.day,
                "location": day.location,
                "image": getattr(day, "image_url", ""),
                "activities": day.activities,
            }
            for day in plan.days
        ],
        "evaluation": {
            "pros": plan.evaluation.pros,
            "cons": plan.evaluation.cons,
            "best_for": plan.evaluation.best_for,
            "tradeoffs": plan.evaluation.tradeoffs,
        },
    }


def _extract_unique_locations(plan: TravelPlan) -> list[str]:
    """Collect unique plan locations in first-seen order."""
    unique_locations: list[str] = []
    seen: set[str] = set()

    for day in plan.days:
        location = day.location.strip()
        if not location or location in seen:
            continue
        seen.add(location)
        unique_locations.append(location)

    return unique_locations


def _build_search_query(request: TravelRequest) -> str:
    """Build a location-first Tavily query that works for countries, states, cities, and regions."""
    location = request.origin.strip()
    cleaned_preferences = [preference.strip().lower() for preference in request.preferences if preference.strip()]

    preference_text = ", ".join(cleaned_preferences) if cleaned_preferences else "general sightseeing"

    return (
        f"Best places to visit in {location}. "
        f"Travel destination guide for {location} focused on {preference_text}. "
        f"Include tourist attractions, nature spots, viewpoints, landmarks, things to do, and local highlights in {location}."
    )


def _error_response(stage: str, detail: str, **context: Any) -> dict[str, Any]:
    """Return a frontend-consumable error payload with stage-specific backend details."""
    payload: dict[str, Any] = {
        "recommended_plan": "",
        "plans": [],
        "error": {
            "stage": stage,
            "detail": detail,
        },
    }

    if context:
        payload["error"]["context"] = context

    return payload