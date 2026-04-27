import json
import os

from langchain_core.prompts import ChatPromptTemplate
from langchain.chat_models import init_chat_model
from pydantic import BaseModel, Field, ValidationError
from langchain_core.language_models import BaseChatModel    

from app.schemas.travel import Place


class PlaceExtractionResult(BaseModel):
    """Structured wrapper for LLM-extracted travel places."""

    places: list[Place] = Field(default_factory=list)


class PlaceExtractor:
    """Extract structured travel destinations from raw search results using an LLM."""

    def __init__(self, llm: BaseChatModel | None = None) -> None:
        """Initialize the extractor with an injectable chat model."""
        self.llm = llm or init_chat_model(
            model="mistral-small-latest", 
            model_provider="mistralai",
            temperature=0.3,
            api_key=os.getenv("MISTRAL_API_KEY"),
        )
        self.prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You extract real travel destinations from web search results. "
                    "Return only destinations that are clearly relevant for trip planning. "
                    "Ignore irrelevant, promotional, duplicate, or non-destination content. "
                    "Infer each place type using one of: mountain, beach, forest, city. "
                    "Group each place under a logical region name.",
                ),
                (
                    "human",
                    "Extract destination places from these search results and return them as structured data.\n\n"
                    "Search results:\n{search_results}",
                ),
            ]
        )

    async def extract_places(self, search_results: list[dict]) -> list[Place]:
        """Convert raw search results into validated Place objects."""
        normalized_results = self._normalize_search_results(search_results)
        if not normalized_results:
            return []

        try:
            structured_llm = self.llm.with_structured_output(PlaceExtractionResult)
            chain = self.prompt | structured_llm
            result = await chain.ainvoke(
                {"search_results": json.dumps(normalized_results, ensure_ascii=False, indent=2)}
            )
        except Exception:
            return []

        try:
            validated = PlaceExtractionResult.model_validate(result)
        except ValidationError:
            return []

        return validated.places

    def _normalize_search_results(self, search_results: list[dict]) -> list[dict[str, str]]:
        """Filter raw search results down to the fields needed by the extraction prompt."""
        normalized_results: list[dict[str, str]] = []

        for item in search_results:
            if not isinstance(item, dict):
                continue

            title = item.get("title")
            url = item.get("url")
            content = item.get("content")

            if not isinstance(title, str) or not title.strip():
                continue
            if not isinstance(url, str) or not url.strip():
                continue
            if not isinstance(content, str):
                content = ""

            normalized_results.append(
                {
                    "title": title.strip(),
                    "url": url.strip(),
                    "content": content.strip(),
                }
            )

        return normalized_results