from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class GazetteerEntry:
    """A known geographic place used to ground niche-destination recognition."""

    name: str
    region: str
    country: str
    type: str  # city, town, hill_station, beach, mountain, forest, etc.
    lat: float
    lon: float


# Curated seed list. Heavily weighted toward India (including niche hill
# stations, towns, and offbeat destinations) plus a set of globally common
# destinations. This guarantees the pipeline can resolve and ground places
# even when web search returns thin or generic content.
_GAZETTEER: list[GazetteerEntry] = [
    # --- Himachal Pradesh (niche hill stations) ---
    GazetteerEntry("Manali", "Himachal Pradesh", "India", "hill_station", 32.2396, 77.1887),
    GazetteerEntry("Shimla", "Himachal Pradesh", "India", "hill_station", 31.1048, 77.1734),
    GazetteerEntry("Dharamshala", "Himachal Pradesh", "India", "hill_station", 32.2190, 76.3234),
    GazetteerEntry("McLeod Ganj", "Himachal Pradesh", "India", "town", 32.2432, 76.3235),
    GazetteerEntry("Kasol", "Himachal Pradesh", "India", "town", 32.0127, 77.3136),
    GazetteerEntry("Tirthan Valley", "Himachal Pradesh", "India", "valley", 31.6333, 77.3500),
    GazetteerEntry("Spiti Valley", "Himachal Pradesh", "India", "valley", 32.5833, 78.0000),
    GazetteerEntry("Kullu", "Himachal Pradesh", "India", "town", 31.9600, 77.1080),
    # --- Uttarakhand ---
    GazetteerEntry("Dehradun", "Uttarakhand", "India", "city", 30.3165, 78.0322),
    GazetteerEntry("Mussoorie", "Uttarakhand", "India", "hill_station", 30.4598, 78.0644),
    GazetteerEntry("Nainital", "Uttarakhand", "India", "hill_station", 29.3803, 79.4636),
    GazetteerEntry("Auli", "Uttarakhand", "India", "hill_station", 30.5300, 79.5700),
    GazetteerEntry("Rishikesh", "Uttarakhand", "India", "town", 30.0869, 78.2676),
    GazetteerEntry("Chopta", "Uttarakhand", "India", "hill_station", 30.4500, 79.2000),
    # --- North-East India (very niche) ---
    GazetteerEntry("Tawang", "Arunachal Pradesh", "India", "town", 27.5800, 91.8600),
    GazetteerEntry("Ziro", "Arunachal Pradesh", "India", "town", 27.5500, 93.8300),
    GazetteerEntry("Shillong", "Meghalaya", "India", "hill_station", 25.5788, 91.8933),
    GazetteerEntry("Cherrapunji", "Meghalaya", "India", "town", 25.3000, 91.7000),
    GazetteerEntry("Kaziranga", "Assam", "India", "forest", 26.5775, 93.4300),
    GazetteerEntry("Gangtok", "Sikkim", "India", "hill_station", 27.3314, 88.6138),
    GazetteerEntry("Pelling", "Sikkim", "India", "town", 27.3000, 88.2000),
    # --- Karnataka ---
    GazetteerEntry("Coorg", "Karnataka", "India", "hill_station", 12.3375, 75.8069),
    GazetteerEntry("Bengaluru", "Karnataka", "India", "city", 12.9716, 77.5946),
    GazetteerEntry("Hampi", "Karnataka", "India", "town", 15.3350, 76.4600),
    GazetteerEntry("Gokarna", "Karnataka", "India", "beach", 14.5500, 74.3000),
    GazetteerEntry("Chikmagalur", "Karnataka", "India", "hill_station", 13.3167, 75.7667),
    # --- Kerala ---
    GazetteerEntry("Munnar", "Kerala", "India", "hill_station", 10.0889, 77.0595),
    GazetteerEntry("Wayanad", "Kerala", "India", "hill_station", 11.6850, 76.1320),
    GazetteerEntry("Alleppey", "Kerala", "India", "town", 9.4981, 76.3388),
    GazetteerEntry("Kochi", "Kerala", "India", "city", 9.9312, 76.2673),
    GazetteerEntry("Thekkady", "Kerala", "India", "town", 9.6000, 77.1600),
    # --- Rajasthan ---
    GazetteerEntry("Jaipur", "Rajasthan", "India", "city", 26.9124, 75.7873),
    GazetteerEntry("Udaipur", "Rajasthan", "India", "city", 24.5854, 73.7125),
    GazetteerEntry("Jaisalmer", "Rajasthan", "India", "city", 26.9157, 70.9083),
    GazetteerEntry("Jodhpur", "Rajasthan", "India", "city", 26.2389, 73.0243),
    # --- Other India ---
    GazetteerEntry("Goa", "Goa", "India", "beach", 15.2993, 74.1240),
    GazetteerEntry("Andaman Islands", "Andaman and Nicobar", "India", "beach", 11.7400, 92.7700),
    GazetteerEntry("Pondicherry", "Puducherry", "India", "town", 11.9416, 79.8083),
    GazetteerEntry("Mahabalipuram", "Tamil Nadu", "India", "town", 12.6269, 80.1923),
    GazetteerEntry("Ooty", "Tamil Nadu", "India", "hill_station", 11.4102, 76.6950),
    GazetteerEntry("Kodaikanal", "Tamil Nadu", "India", "hill_station", 10.2333, 77.4833),
    GazetteerEntry("Darjeeling", "West Bengal", "India", "hill_station", 27.0410, 88.2663),
    GazetteerEntry("Varanasi", "Uttar Pradesh", "India", "city", 25.3176, 82.9739),
    GazetteerEntry("Agra", "Uttar Pradesh", "India", "city", 27.1767, 78.0081),
    GazetteerEntry("Amritsar", "Punjab", "India", "city", 31.6340, 74.8723),
    GazetteerEntry("Leh", "Ladakh", "India", "town", 34.1526, 77.5771),
    GazetteerEntry("Pahalgam", "Jammu and Kashmir", "India", "town", 34.0140, 75.3170),
    GazetteerEntry("Gulmarg", "Jammu and Kashmir", "India", "town", 34.0470, 74.3800),
    GazetteerEntry("Mcleodganj", "Himachal Pradesh", "India", "town", 32.2432, 76.3235),
    # --- Global destinations ---
    GazetteerEntry("Bali", "Bali", "Indonesia", "beach", -8.3405, 115.0920),
    GazetteerEntry("Phuket", "Phuket", "Thailand", "beach", 7.8804, 98.3923),
    GazetteerEntry("Bangkok", "Bangkok", "Thailand", "city", 13.7563, 100.5018),
    GazetteerEntry("Tokyo", "Tokyo", "Japan", "city", 35.6762, 139.6503),
    GazetteerEntry("Kyoto", "Kyoto", "Japan", "city", 35.0116, 135.7681),
    GazetteerEntry("Paris", "Île-de-France", "France", "city", 48.8566, 2.3522),
    GazetteerEntry("Swiss Alps", "Valais", "Switzerland", "mountain", 46.0207, 7.7491),
    GazetteerEntry("Reykjavik", "Capital Region", "Iceland", "city", 64.1466, -21.9426),
    GazetteerEntry("Santorini", "South Aegean", "Greece", "island", 36.3932, 25.4615),
    GazetteerEntry("New York", "New York", "United States", "city", 40.7128, -74.0060),
    GazetteerEntry("San Francisco", "California", "United States", "city", 37.7749, -122.4194),
    GazetteerEntry("London", "England", "United Kingdom", "city", 51.5074, -0.1278),
    GazetteerEntry("Rome", "Lazio", "Italy", "city", 41.9028, 12.4964),
    GazetteerEntry("Barcelona", "Catalonia", "Spain", "city", 41.3851, 2.1734),
    GazetteerEntry("Dubai", "Dubai", "United Arab Emirates", "city", 25.2048, 55.2708),
    GazetteerEntry("Singapore", "Singapore", "Singapore", "city", 1.3521, 103.8198),
    GazetteerEntry("Maldives", "Maldives", "Maldives", "beach", 3.2028, 73.2207),
    GazetteerEntry("Pokhara", "Gandaki", "Nepal", "city", 28.2096, 83.9856),
    GazetteerEntry("Kathmandu", "Bagmati", "Nepal", "city", 27.7172, 85.3240),
    GazetteerEntry("Colombo", "Western", "Sri Lanka", "city", 6.9271, 79.8612),
    GazetteerEntry("Hanoi", "Hanoi", "Vietnam", "city", 21.0278, 105.8342),
    GazetteerEntry("Ho Chi Minh City", "Ho Chi Minh", "Vietnam", "city", 10.8231, 106.6297),
    GazetteerEntry("Siem Reap", "Siem Reap", "Cambodia", "city", 13.3521, 103.8552),
    GazetteerEntry("Cape Town", "Western Cape", "South Africa", "city", -33.9249, 18.4241),
    GazetteerEntry("Sydney", "New South Wales", "Australia", "city", -33.8688, 151.2093),
    GazetteerEntry("Queenstown", "Otago", "New Zealand", "town", -45.0312, 168.6626),
    GazetteerEntry("Marrakech", "Marrakesh-Safi", "Morocco", "city", 31.6295, -7.9811),
    GazetteerEntry("Istanbul", "Istanbul", "Turkey", "city", 41.0082, 28.9784),
]


def _normalize(text: str) -> str:
    """Lowercase and strip punctuation/spaces for tolerant matching."""
    return "".join(ch for ch in text.lower() if ch.isalnum() or ch == " ").strip()


_NORMALIZED_INDEX: dict[str, GazetteerEntry] = {
    _normalize(entry.name): entry for entry in _GAZETTEER
}


def lookup(name: str) -> GazetteerEntry | None:
    """Find a gazetteer entry by exact normalized name, else by substring."""
    normalized = _normalize(name)
    if not normalized:
        return None

    if normalized in _NORMALIZED_INDEX:
        return _NORMALIZED_INDEX[normalized]

    # Substring / contains fallback (e.g. "manali himachal" -> "manali").
    for key, entry in _NORMALIZED_INDEX.items():
        if key in normalized or normalized in key:
            return entry

    return None


def entries_for_region(region: str, country: str | None = None) -> list[GazetteerEntry]:
    """Return gazetteer entries matching a region (and optionally country)."""
    region_norm = _normalize(region)
    matches: list[GazetteerEntry] = []
    for entry in _GAZETTEER:
        if _normalize(entry.region) != region_norm:
            continue
        if country and _normalize(entry.country) != _normalize(country):
            continue
        matches.append(entry)
    return matches


def all_entries() -> list[GazetteerEntry]:
    """Return a copy of all gazetteer entries."""
    return list(_GAZETTEER)
