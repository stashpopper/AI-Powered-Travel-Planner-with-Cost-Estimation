import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_travel_planning_e2e():
    """
    End-to-End test for the complete travel planning pipeline
    This tests the /app/api/v1/travel/plan endpoint
    """
    
    payload = {
        "origin": "New York",
        "preferences": ["nature", "hiking", "quiet"],
        "days": 3,
        "budget": 1000
    }

    # Make request to the plan endpoint
    response = client.post("/app/api/v1/travel/plan", json=payload)
    
    # Assert successful response format
    assert response.status_code == 200, f"Expected 200 OK, got {response.status_code} with body: {response.text}"
    
    data = response.json()
    
    # Validate the response schema structure
    assert "plans" in data
    assert "recommended_plan" in data
    
    # Needs to return at least one plan
    assert len(data["plans"]) > 0
    assert data["recommended_plan"] is not None

    # Deeper validation of the first plan
    plan = data["plans"][0]
    assert "title" in plan
    assert "days" in plan
    assert len(plan["days"]) > 0
    assert "cost" in plan
    assert plan["cost"]["total"] >= 0
    assert "evaluation" in plan
    
def test_travel_planning_fallback_e2e():
    """
    Test what happens with an empty payload or missing fields
    """
    payload = {} # Missing required fields
    response = client.post("/app/api/v1/travel/plan", json=payload)
    
    # Should get a validation error (422 Unprocessable Entity)
    assert response.status_code == 422
