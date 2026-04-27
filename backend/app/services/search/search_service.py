import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[3] / ".env")

import httpx


class TravelSearchService:
    """Async service for fetching structured travel search results from Tavily."""

    _endpoint = "https://api.tavily.com/search"

    def __init__(self, api_key: str | None = None) -> None:
        """Initialize the service with a Tavily API key from args or environment."""
        self.api_key = api_key or os.getenv("TAVILY_API_KEY")

    async def search_places(self, query: str) -> list[dict[str, str]]:
        """Search Tavily and return a normalized list of title, url, and content fields."""
        if not self.api_key:
            return []

        cleaned_query = query.strip()
        if not cleaned_query:
            return []

        payload = {
            "api_key": self.api_key,
            "query": cleaned_query,
            "search_depth": "basic",
            "max_results": 5,
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(self._endpoint, json=payload)
                response.raise_for_status()
                data = response.json()
        except (httpx.HTTPError, ValueError):
            return []

        return self._normalize_results(data)

    def _normalize_results(self, data: dict[str, Any]) -> list[dict[str, str]]:
        """Convert Tavily response data into the expected structured result format."""
        results = data.get("results")
        if not isinstance(results, list):
            return []

        normalized_results: list[dict[str, str]] = []
        for item in results:
            if not isinstance(item, dict):
                continue

            title = item.get("title")
            url = item.get("url")
            content = item.get("content", "")

            if not isinstance(title, str) or not isinstance(url, str):
                continue

            if not isinstance(content, str):
                content = ""

            normalized_results.append(
                {
                    "title": title,
                    "url": url,
                    "content": content,
                }
            )

        return normalized_results