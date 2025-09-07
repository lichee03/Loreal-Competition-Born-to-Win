import requests
import csv
import datetime
import os
from langdetect import detect, DetectorFactory
import time

# Fix randomness in langdetect
DetectorFactory.seed = 0

# --- CONFIG ---
TRENDS_URL = "https://twitter-trends-api.p.rapidapi.com/trends?woeid=23424977" 
SEARCH_URL = "https://twitter241.p.rapidapi.com/search-v2"

RAPIDAPI_HEADERS_TRENDS = {
    "x-rapidapi-host": "twitter-trends-api.p.rapidapi.com",
    "x-rapidapi-key": "b5027582a5msh6f3d48a00874865p1adcd8jsn0c237980cc39"
}

RAPIDAPI_HEADERS_SEARCH = {
    "x-rapidapi-host": "twitter241.p.rapidapi.com",
    "x-rapidapi-key": "b5027582a5msh6f3d48a00874865p1adcd8jsn0c237980cc39" 
}

CSV_FILE = "tweet_trends.csv"

# --- FUNCTIONS ---
def fetch_trends():
    """Fetch trending topics from RapidAPI."""
    response = requests.get(TRENDS_URL, headers=RAPIDAPI_HEADERS_TRENDS)
    data = response.json()
    return data.get("trends", [])


def fetch_trend_details(trend_name):
    params = {
        "query": trend_name,  
        "type": "latest",
        "count": 100
    }
    try:
        response = requests.get(SEARCH_URL, headers=RAPIDAPI_HEADERS_SEARCH, params=params)
        data = response.json()
    except Exception as e:
        print(f"Error fetching details for {trend_name}: {e}")
        return 0, 0, "Other"

    tweets = []
    instructions = data.get("result", {}).get("timeline", {}).get("instructions", [])
    for instr in instructions:
        if instr.get("type") == "TimelineAddEntries":
            entries = instr.get("entries", [])
            for entry in entries:
                content = entry.get("content", {})
                if content.get("entryType") == "TimelineTimelineItem":
                    tweet_item = content.get("itemContent", {}).get("tweet_results", {}).get("result", {})
                    if tweet_item:
                        user = tweet_item.get("core", {}).get("user_results", {}).get("result", {})
                        screen_name = user.get("core", {}).get("screen_name")
                        legacy = tweet_item.get("legacy", {})
                        retweet_count = legacy.get("retweet_count", 0)
                        favorite_count = legacy.get("favorite_count", 0)
                        view_count = int(tweet_item.get("views", {}).get("count", 0))
                        tweets.append({
                            "user": screen_name,
                            "retweets": retweet_count,
                            "likes": favorite_count,
                            "views": view_count
                        })

    unique_creators = list({t["user"] for t in tweets if t["user"]})
    engagement = sum(t["retweets"] + t["likes"] + t["views"] for t in tweets)

    return engagement, unique_creators




def process_trends():
    """Main function to fetch trends, get details, and save to CSV."""
    trends = fetch_trends()
    today = datetime.date.today().isoformat()
    results = []

    for trend in trends:
        trend_name = trend.get("name", "")
        if not trend_name:
            continue

        # Skip non-English trends
        try:
            if detect(trend_name) != "en":
                continue
        except:
            continue

        # Determine token type
        if trend_name.startswith("#"):
            token_type = "hashtag"
        elif trend_name.startswith("$"):
            token_type = "ticker"
        else:
            token_type = "keyword"

        # Fetch detailed metrics
        engagement, unique_creators, category = fetch_trend_details(trend_name)
        # Be polite with API
        time.sleep(1)

        results.append({
            "trend_id": trend_name,
            "token_type": token_type,
            "platform": "x",
            "date": today,
            "volume": trend.get("tweet_volume"),
            "engagement": engagement,
            "unique_creators": unique_creators,
            "audience_signals": None,
            "category": None,
            "geo": "United States"
        })

    save_to_csv(results)
    print(f"Trends appended to {CSV_FILE}")


def save_to_csv(data):
    """Save list of trend dicts to CSV."""
    file_exists = os.path.isfile(CSV_FILE)
    with open(CSV_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "trend_id", "token_type", "platform", "date",
            "volume", "engagement", "unique_creators",
            "audience_signals", "category", "geo"
        ])
        if not file_exists:
            writer.writeheader()
        writer.writerows(data)


# --- ENTRY POINT ---
if __name__ == "__main__":
    process_trends()