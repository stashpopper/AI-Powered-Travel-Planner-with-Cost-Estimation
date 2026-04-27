import asyncio
from dotenv import load_dotenv
load_dotenv()

from app.services.planner.place_extractor import PlaceExtractor

async def main():
    extractor = PlaceExtractor()
    
    # Mock search results to test the LLM extraction
    mock_results = [
        {
            "title": "Top 10 Beaches in Bali",
            "url": "https://example.com/bali-beaches",
            "content": "Kuta Beach is famous for surfing and sunsets. Uluwatu offers dramatic cliffs and hidden coves."
        },
        {
            "title": "Mount Batur Trekking Guide",
            "url": "https://example.com/batur",
            "content": "Mount Batur is an active volcano in the Kintamani highlands, great for sunrise hikes."
        }
    ]
    
    print("Extracting places via LLM...")
    places = await extractor.extract_places(mock_results)
    
    if not places:
        print("No places extracted. Check your MISTRAL_API_KEY and syntax.")
    else:
        for p in places:
            print(f"- {p.name} ({p.type}) in {p.region}")

if __name__ == "__main__":
    asyncio.run(main())