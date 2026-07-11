from __future__ import annotations

from dataclasses import dataclass

from app.schemas.travel import PlanEvaluation, TravelPlan


@dataclass(slots=True)
class PlanMetrics:
    """Deterministic metrics used for comparing travel plans."""

    title: str
    total_cost: int
    normalized_cost: float
    total_travel_time: float
    unique_locations: int
    score: float


class EvaluationService:
    """Evaluate, rank, and recommend travel plans using deterministic scoring."""

    def __init__(
        self,
        cost_weight: float = 1.0,
        travel_weight: float = 0.3,
        diversity_weight: float = 0.5,
    ) -> None:
        """Initialize configurable weights for plan comparison."""
        self.cost_weight = cost_weight
        self.travel_weight = travel_weight
        self.diversity_weight = diversity_weight

    def evaluate_plans(self, plans: list[TravelPlan]) -> tuple[list[TravelPlan], str]:
        """Return ranked plans with refreshed evaluation fields and a recommendation title."""
        if not plans:
            return [], ""

        max_cost = max((plan.cost.total for plan in plans), default=0)
        safe_max_cost = max(max_cost, 1)

        metrics_by_title: dict[str, PlanMetrics] = {}
        for plan in plans:
            metrics = self._build_metrics(plan, safe_max_cost)
            metrics_by_title[plan.title] = metrics

        ranked_plans = sorted(
            plans,
            key=lambda plan: (
                -metrics_by_title[plan.title].score,  # Higher score = better
                metrics_by_title[plan.title].total_cost,
                metrics_by_title[plan.title].total_travel_time,
                -metrics_by_title[plan.title].unique_locations,
                plan.title,
            ),
        )

        ranked_evaluated_plans = [
            plan.model_copy(
                update={
                    "evaluation": self._build_evaluation(
                        metrics_by_title[plan.title],
                        plan.title == ranked_plans[0].title,
                    )
                }
            )
            for plan in ranked_plans
        ]

        return ranked_evaluated_plans, ranked_plans[0].title

    def _build_metrics(self, plan: TravelPlan, max_cost: int) -> PlanMetrics:
        """Compute normalized comparison metrics for a single plan."""
        total_cost = plan.cost.total
        normalized_cost = total_cost / max_cost if max_cost > 0 else 0.0
        total_travel_time = sum(day.travel_time_hours for day in plan.days)
        unique_locations = len({day.location.strip() for day in plan.days if day.location.strip()})
        # Lower cost and travel time are better; higher diversity is better.
        # Normalize travel time to [0, 1] range using a reasonable cap (24h total).
        max_travel_hours = 24.0
        normalized_travel = min(total_travel_time / max_travel_hours, 1.0)
        score = (
            -(self.cost_weight * normalized_cost)
            - (self.travel_weight * normalized_travel)
            + (self.diversity_weight * unique_locations)
        )

        return PlanMetrics(
            title=plan.title,
            total_cost=total_cost,
            normalized_cost=normalized_cost,
            total_travel_time=total_travel_time,
            unique_locations=unique_locations,
            score=score,
        )

    def _build_evaluation(self, metrics: PlanMetrics, is_recommended: bool) -> PlanEvaluation:
        """Generate human-readable evaluation text from deterministic plan metrics."""
        pros: list[str] = []
        cons: list[str] = []

        if metrics.normalized_cost <= 0.5:
            pros.append("Keeps overall trip cost comparatively low")
        else:
            cons.append("Comes with a comparatively higher total cost")

        if metrics.total_travel_time <= 6:
            pros.append("Maintains efficient travel time across the itinerary")
        elif metrics.total_travel_time <= 12:
            pros.append("Balances sightseeing with manageable travel time")
        else:
            cons.append("Includes heavier inter-location travel time")

        if metrics.unique_locations >= 3:
            pros.append("Covers a diverse mix of locations and experiences")
        else:
            cons.append("Offers less location variety than other options")

        if not pros:
            pros.append("Provides a workable end-to-end itinerary structure")

        if not cons:
            cons.append("Requires normal tradeoffs between cost, pace, and variety")

        if metrics.normalized_cost <= 0.45 and metrics.total_travel_time <= 8:
            best_for = "Travelers who want strong value and efficient movement"
        elif metrics.unique_locations >= 4:
            best_for = "Travelers who want maximum variety and exploration"
        elif metrics.total_travel_time <= 6:
            best_for = "Travelers who prefer a smoother and lower-transfer trip"
        else:
            best_for = "Travelers seeking a balanced mix of comfort, cost, and variety"

        tradeoffs = (
            f"Score {metrics.score:.2f}: cost is {metrics.total_cost}, total travel time is "
            f"{metrics.total_travel_time:.1f} hours, and the plan covers {metrics.unique_locations} unique locations."
        )

        if is_recommended:
            pros.insert(0, "Best overall balance across cost, travel efficiency, and diversity")

        return PlanEvaluation(
            pros=pros,
            cons=cons,
            best_for=best_for,
            tradeoffs=tradeoffs,
        )