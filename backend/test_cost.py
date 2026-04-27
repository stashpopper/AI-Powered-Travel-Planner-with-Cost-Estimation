import pytest
from pydantic import ValidationError
from app.schemas.travel import CostBreakdown

def test_valid_cost_breakdown():
    """Test that a valid cost breakdown with matching total passes validation."""
    cost = CostBreakdown(
        transport=100,
        stay=200,
        food=150,
        misc=50,
        total=500
    )
    assert cost.total == 500
    assert cost.transport == 100

def test_invalid_cost_total():
    """Test that an incorrect total raises a ValidationError."""
    with pytest.raises(ValidationError) as exc_info:
        CostBreakdown(
            transport=100,
            stay=200,
            food=150,
            misc=50,
            total=400  # Incorrect total
        )
    assert "total must equal transport + stay + food + misc" in str(exc_info.value)

def test_negative_costs():
    """Test that negative costs raise a ValidationError."""
    with pytest.raises(ValidationError):
        CostBreakdown(
            transport=-10,
            stay=200,
            food=150,
            misc=50,
            total=390
        )

def test_zero_total():
    """Test that zero costs are valid if the total is also zero."""
    cost = CostBreakdown(
        transport=0,
        stay=0,
        food=0,
        misc=0,
        total=0
    )
    assert cost.total == 0
