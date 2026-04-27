import pytest
import asyncio
import os
import httpx

from app.services.cost.cost_service import CostService
from app.schemas.travel import TravelPlan, DayPlan, CostBreakdown, PlanEvaluation

@pytest.fixture
def service():
    return CostService()

def build_test_plan() -> TravelPlan:
    return TravelPlan(
        title="Test Trip",
        days=[
            DayPlan(day=1, location="Kolkata", activities=["Sightseeing"], travel_time_hours=2.0, lat=None, lon=None),
            DayPlan(day=2, location="Darjeeling", activities=["Tea gardens"], travel_time_hours=2.0, lat=None, lon=None),
            DayPlan(day=3, location="Gangtok", activities=["Monastery"], travel_time_hours=2.0, lat=None, lon=None),
        ],
        cost=CostBreakdown(transport=0, stay=0, food=0, misc=0, total=0),
        evaluation=PlanEvaluation(
            pros=["Scenic views"],
            cons=["Long travel"],
            best_for="Adventure",
            tradeoffs="Cost vs experience"
        )
    )


@pytest.mark.asyncio
async def test_llm_only(service: CostService):
    print("\n[TEST] LLM city cost estimation")
    result = await service.estimate_city_costs("Kolkata")
    print("Result:", result)

    assert "hotel_per_night" in result
    assert "food_per_day" in result
    assert result["hotel_per_night"] > 0
    assert result["food_per_day"] > 0

@pytest.mark.asyncio
async def test_geocoding(service: CostService):
    print("\n[TEST] Geocoding")
    async with httpx.AsyncClient(headers=service._headers, timeout=service._timeout) as client:
        coords = await service._geocode_location("Kolkata", client)
        print("Coords:", coords)
        assert coords is not None

@pytest.mark.asyncio
async def test_distance(service: CostService):
    print("\n[TEST] Distance calculation")

    async with httpx.AsyncClient(headers=service._headers, timeout=service._timeout) as client:
        start = {"location": "Kolkata", "lat": 22.5726, "lon": 88.3639}
        end = {"location": "Darjeeling", "lat": 27.0360, "lon": 88.2627}

        dist = await service._fetch_route_distance_km(start, end, client)
        print("Distance:", dist)

        assert dist > 0

@pytest.mark.asyncio
async def test_full_pipeline(service: CostService):
    print("\n[TEST] Full pipeline")

    plan = build_test_plan()
    result = await service.compute_cost(plan)

    print("Breakdown:", result)

    assert result.total > 0
    assert result.transport >= 0
    assert result.stay >= 0
    assert result.food >= 0

@pytest.mark.asyncio
async def test_failure_fallback(service: CostService):
    print("\n[TEST] Failure fallback (simulate bad input)")

    bad_plan = TravelPlan(
        title="Test",
        days=[DayPlan(day=1, location="Kolkata", activities=["Test"], travel_time_hours=0)],
        cost=CostBreakdown(transport=0, stay=0, food=0, misc=0, total=0),
        evaluation=PlanEvaluation(pros=["test"], cons=["test"], best_for="test", tradeoffs="test")
    )
    result = await service.compute_cost(bad_plan)

    print("Fallback result:", result)
    assert result.total >= 0


async def main():
    if not os.getenv("MISTRAL_API_KEY"):
        raise RuntimeError("Missing MISTRAL_API_KEY")

    service = CostService()

    await test_llm_only(service)
    await test_geocoding(service)
    await test_distance(service)
    await test_full_pipeline(service)
    await test_failure_fallback(service)

    print("\nAll tests passed.")


if __name__ == "__main__":
    asyncio.run(main())
