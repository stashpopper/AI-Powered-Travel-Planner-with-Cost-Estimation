import asyncio
import os
from dotenv import load_dotenv  # Add this
load_dotenv()                   # Add this - it reads the .env file

from app.services.search.search_service import TravelSearchService


async def main():
    # 1. Set your API key (if it's not in your .env file)
    # os.environ["TAVILY_API_KEY"] = "your-key-here"
    
    # 2. Initialize the service
    service = TravelSearchService()
    
    # 3. Try a search
    print("Searching for 'best beaches in Bali'...")
    results = await service.search_places("best beaches in Bali")
    
    # 4. Print results
    if not results:
        print("No results found. Check your API key or connection.")
    else:
        for i, res in enumerate(results, 1):
            print(f"\n[{i}] {res['title']}")
            print(f"URL: {res['url']}")
            print(f"Content: {res['content'][:100]}...")

if __name__ == "__main__":
    asyncio.run(main())