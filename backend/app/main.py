from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router


def create_application() -> FastAPI:
    """Create and configure the FastAPI application instance."""
    app = FastAPI(title="AI Travel Planner API", version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost",
            "http://localhost:80",
            "http://localhost:5173",
            "http://localhost:5174",
            "https://voyageagent.netlify.app",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix="/app/api/v1")
    return app


app = create_application()