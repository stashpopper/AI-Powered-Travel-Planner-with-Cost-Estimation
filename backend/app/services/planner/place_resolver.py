from __future__ import annotations

import os
from dataclasses import dataclass

import httpx

from app.schemas.travel import Place
from app.services.search.gazetteer import entries_for_region, lookup


@dataclass(frozen=True)
class ResolvedPlace:
    """A grounded interpretation of a user-entered destination string."""

    name: str
    region: str
    country: str
    type: str
    lat: float | None
    lon: float | None
    # Whether the destination was matched against a known source (gazetteer or
    # geocoder). When False the resolver fell back to the raw input.
    matched: bool
    source: str  # "gazetteer" | "geocoder" | "fallback"


class PlaceResolver:
    """Resolve and ground a free-text destination into a canonical place.

    Resolution order:
      1. Local gazetteer (instant, offline, covers niche places like Manali).
      2. Optional online geocoder (Nominatim) when an API base is configured.
      3. Fallback that keeps the raw input so the pipeline never hard-fails.
    """

    def __init__(self, geocoder_base_url: str | None = None, timeout: float = 5.0) -> None:
        # Nominatim is the default free geocoder; override via env if needed.
        self.geocoder_base_url = geocoder_base_url or os.getenv(
            "NOMINATIM_BASE_URL", "https://nominatim.openstreetmap.org"
        )
        self.timeout = timeout

    def resolve(self, destination: str) -> ResolvedPlace:
        """Resolve a destination string into a grounded ResolvedPlace."""
        raw = (destination or "").strip()
        if not raw:
            return ResolvedPlace(
                name="Unknown", region="", country="", type="city",
                lat=None, lon=None, matched=False, source="fallback",
            )

        gazetteer_hit = lookup(raw)
        if gazetteer_hit is not None:
            return ResolvedPlace(
                name=gazetteer_hit.name,
                region=gazetteer_hit.region,
                country=gazetteer_hit.country,
                type=gazetteer_hit.type,
                lat=gazetteer_hit.lat,
                lon=gazetteer_hit.lon,
                matched=True,
                source="gazetteer",
            )

        geocoded = self._geocode(raw)
        if geocoded is not None:
            return geocoded

        # Fallback: keep the user input but mark as unmatched so downstream
        # steps know grounding was weak.
        return ResolvedPlace(
            name=raw, region="", country="", type="city",
            lat=None, lon=None, matched=False, source="fallback",
        )

    def _geocode(self, destination: str) -> ResolvedPlace | None:
        """Best-effort online geocoding; returns None on any failure."""
        if not self.geocoder_base_url:
            return None
        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.get(
                    f"{self.geocoder_base_url.rstrip('/')}/search",
                    params={"q": destination, "format": "json", "limit": 1},
                    headers={"User-Agent": "ai-travel-planner/1.0"},
                )
                response.raise_for_status()
                data = response.json()
        except (httpx.HTTPError, ValueError):
            return None

        if not isinstance(data, list) or not data:
            return None

        first = data[0]
        if not isinstance(first, dict):
            return None

        display = (first.get("display_name") or "").split(",")
        country = display[-1].strip() if display else ""
        region = display[-2].strip() if len(display) > 1 else ""
        lat = _to_float(first.get("lat"))
        lon = _to_float(first.get("lon"))

        return ResolvedPlace(
            name=first.get("name") or destination,
            region=region,
            country=country,
            type="city",
            lat=lat,
            lon=lon,
            matched=True,
            source="geocoder",
        )

    def seed_places(self, resolved: ResolvedPlace, limit: int = 12) -> list[Place]:
        """Build fallback candidate places from the gazetteer when extraction is thin.

        If the resolved destination matched a region, return sibling places in
        that region. Otherwise return a broad sample so the itinerary step still
        has candidates and never hard-fails on a niche input.
        """
        seeds: list[Place] = []

        if resolved.matched and resolved.region:
            for entry in entries_for_region(resolved.region, resolved.country):
                seeds.append(
                    Place(
                        name=entry.name,
                        type=entry.type,
                        region=entry.region,
                        parent=resolved.name if entry.name != resolved.name else None,
                        kind="attraction" if entry.name != resolved.name else "destination",
                    )
                )

        if not seeds:
            from app.services.search.gazetteer import all_entries

            for entry in all_entries()[:limit]:
                seeds.append(
                    Place(
                        name=entry.name,
                        type=entry.type,
                        region=entry.region,
                        kind="attraction",
                    )
                )

        return seeds[:limit]


def _to_float(value: object) -> float | None:
    """Safely coerce a geocoder coordinate string into a float."""
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None
