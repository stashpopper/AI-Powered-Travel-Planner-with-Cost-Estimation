from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field, field_validator, model_validator


class TravelRequest(BaseModel):
    """Input payload for generating travel plans."""

    origin: str
    preferences: list[str]
    budget: Optional[int] = Field(default=None, gt=0)
    days: int = Field(ge=1, le=30)

    @field_validator("origin")
    @classmethod
    def validate_origin(cls, value: str) -> str:
        """Ensure the origin is a non-empty string."""
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("origin must not be empty")
        return cleaned

    @field_validator("preferences")
    @classmethod
    def validate_preferences(cls, value: list[str]) -> list[str]:
        """Ensure preferences contain non-empty values."""
        if not value:
            raise ValueError("preferences must contain at least one item")

        cleaned_preferences = []
        for item in value:
            cleaned = item.strip()
            if not cleaned:
                raise ValueError("preferences must not contain empty values")
            cleaned_preferences.append(cleaned)

        return cleaned_preferences


class Place(BaseModel):
    """A structured representation of a destination or attraction."""

    name: str
    type: str
    region: str

    @field_validator("name", "type", "region")
    @classmethod
    def validate_text_fields(cls, value: str) -> str:
        """Ensure place fields are non-empty strings."""
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("place fields must not be empty")
        return cleaned


class DayPlan(BaseModel):
    """A single day's itinerary details within a travel plan."""

    day: int = Field(ge=1)
    location: str
    activities: list[str]
    travel_time_hours: float = Field(ge=0)
    lat: float | None = None
    lon: float | None = None

    @field_validator("location")
    @classmethod
    def validate_location(cls, value: str) -> str:
        """Ensure the day plan location is not blank."""
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("location must not be empty")
        return cleaned

    @field_validator("activities")
    @classmethod
    def validate_activities(cls, value: list[str]) -> list[str]:
        """Ensure activities contain non-empty values."""
        if not value:
            raise ValueError("activities must contain at least one item")

        cleaned_activities = []
        for item in value:
            cleaned = item.strip()
            if not cleaned:
                raise ValueError("activities must not contain empty values")
            cleaned_activities.append(cleaned)

        return cleaned_activities


class CostBreakdown(BaseModel):
    """Deterministic cost summary for a travel plan."""

    transport: int = Field(ge=0)
    stay: int = Field(ge=0)
    food: int = Field(ge=0)
    misc: int = Field(ge=0)
    total: int

    @model_validator(mode="after")
    def validate_total(self) -> "CostBreakdown":
        """Ensure the total matches the sum of all cost components."""
        expected_total = self.transport + self.stay + self.food + self.misc
        if self.total != expected_total:
            raise ValueError("total must equal transport + stay + food + misc")
        return self


class PlanEvaluation(BaseModel):
    """Human-readable evaluation metadata for a generated travel plan."""

    pros: list[str]
    cons: list[str]
    best_for: str
    tradeoffs: str

    @field_validator("pros", "cons")
    @classmethod
    def validate_points(cls, value: list[str]) -> list[str]:
        """Ensure evaluation bullet lists contain non-empty values."""
        cleaned_points = []
        for item in value:
            cleaned = item.strip()
            if not cleaned:
                raise ValueError("evaluation lists must not contain empty values")
            cleaned_points.append(cleaned)
        return cleaned_points

    @field_validator("best_for", "tradeoffs")
    @classmethod
    def validate_text(cls, value: str) -> str:
        """Ensure evaluation text fields are non-empty."""
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("evaluation text fields must not be empty")
        return cleaned


class TravelPlan(BaseModel):
    """A complete travel plan with itinerary, costs, and evaluation."""

    title: str
    days: list[DayPlan]
    cost: CostBreakdown
    evaluation: PlanEvaluation

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        """Ensure the travel plan title is not blank."""
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("title must not be empty")
        return cleaned

    @model_validator(mode="after")
    def validate_days_sequence(self) -> "TravelPlan":
        """Ensure day numbers are unique and sequential starting from 1."""
        if not self.days:
            raise ValueError("days must contain at least one day plan")

        day_numbers = [day.day for day in self.days]

        if len(day_numbers) != len(set(day_numbers)):
            raise ValueError("days must not contain duplicate day numbers")

        expected_sequence = list(range(1, len(day_numbers) + 1))
        if day_numbers != expected_sequence:
            raise ValueError("days must be sequential starting from 1")

        return self


class TravelResponse(BaseModel):
    """Structured API response containing ranked travel plan options."""

    plans: list[TravelPlan] = Field(min_length=1, max_length=5)
    recommended_plan: str

    @field_validator("recommended_plan")
    @classmethod
    def validate_recommended_plan_text(cls, value: str) -> str:
        """Ensure the recommended plan title is not blank."""
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("recommended_plan must not be empty")
        return cleaned

    @model_validator(mode="after")
    def validate_recommended_plan_exists(self) -> "TravelResponse":
        """Ensure the recommended plan matches one of the available plan titles."""
        plan_titles = {plan.title for plan in self.plans}
        if self.recommended_plan not in plan_titles:
            raise ValueError("recommended_plan must match one of the plan titles")
        return self