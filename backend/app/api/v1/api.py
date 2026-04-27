from fastapi import APIRouter

from app.api.v1.routes.travel import router as travel_router


api_router = APIRouter()
api_router.include_router(travel_router, prefix="/travel", tags=["travel"])