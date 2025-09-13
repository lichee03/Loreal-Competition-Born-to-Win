import pandas as pd
import json
import ast
import os
import re
import pycountry

# Paths
csv_path = os.path.join("app", "data", "trend_aggregated.csv")
json_path = os.path.join("public", "extended_trend_aggregated.json")

# Read CSV
df = pd.read_csv(csv_path)

def clean_audience_string(x: str):
    if pd.isna(x):
        return "{}"
    x = str(x)

    # 1) Fix numpy float wrappers → "np.float64(0.72)" → "0.72"
    x = re.sub(r"np\.float64\(([\d\.eE+-]+)\)", r"\1", x)

    # 2) (optional) Remove stray function-like junk
    x = re.sub(r"[A-Za-z_]+\([^)]*\)", "", x)

    return x.strip()


def parse_audience(x: str):
    x = clean_audience_string(str(x))
    try:
        return json.loads(x)  # if valid JSON
    except:
        try:
            return ast.literal_eval(x)  # if Python dict style
        except:
            return {}  # fallback if still broken

df["audience_dict"] = df["audience_signals"].apply(parse_audience)

# Aggregate per platform
platform_totals = {}
platform_counts = {}
for _, row in df.iterrows():
    platform = str(row["platform"]).lower()
    if platform not in platform_totals:
        platform_totals[platform] = {"gen_z": 0, "millennials": 0}
        platform_counts[platform] = 0

    d = row["audience_dict"]
    if d:
        platform_totals[platform]["gen_z"] += float(d.get("gen_z", 0))
        platform_totals[platform]["millennials"] += float(d.get("millennials", 0))
        platform_counts[platform] += 1

# Convert sums → averages (normalized so ≈1)
for platform in platform_totals:
    count = platform_counts[platform]
    if count > 0:
        platform_totals[platform] = {
            "gen_z": round(platform_totals[platform]["gen_z"] / count, 2),
            "millennials": round(platform_totals[platform]["millennials"] / count, 2),
        }

# -------------------
# GEO normalization
# -------------------
# Simple country/region mapping
region_map = {
    "us": "North America",
    "usa": "North America",
    "united states": "North America",
    "canada": "North America",
    "mexico": "North America",
    "brazil": "South America",
    "argentina": "South America",
    "chile": "South America",
    "uk": "Europe",
    "united kingdom": "Europe",
    "england": "Europe",
    "france": "Europe",
    "spain": "Europe",
    "germany": "Europe",
    "italy": "Europe",
    "switzerland": "Europe",
    "czech republic": "Europe",
    "egypt": "Africa",
    "nigeria": "Africa",
    "south africa": "Africa",
    "india": "Asia",
    "china": "Asia",
    "thailand": "Asia",
    "malaysia": "Asia",
    "uae": "Middle East",
    "dubai": "Middle East",
    "australia": "Oceania",
}

def normalize_geo(raw_geo: str):
    if pd.isna(raw_geo) or not str(raw_geo).strip():
        return None
    text = str(raw_geo).lower().strip()

    # If multiple entries like "Paris, France, Los Angeles"
    if "," in text:
        text = text.split(",")[-1].strip()  

    # Try direct mapping
    for key, region in region_map.items():
        if key in text:
            return region
    return "Other"

df["region"] = df["geo"].apply(normalize_geo)

# Aggregate per region & platform
geo_summary = (
    df.groupby(["platform", "region"])
    .agg(
        active_trends=("trend_id", "count"),
        avg_growth=("growth_rate_7d", "mean")
    )
    .reset_index()
)

geo_dict = {}
for _, row in geo_summary.iterrows():
    platform = row["platform"].lower()
    region = row["region"]
    if platform not in geo_dict:
        geo_dict[platform] = {}
    geo_dict[platform][region] = {
        "active_trends": int(row["active_trends"]),
        "avg_growth": round(row["avg_growth"], 2) if not pd.isna(row["avg_growth"]) else None
    }

# Merge with audience results
final_output = {
    "audience_breakdown": platform_totals,
    "geo_trends": geo_dict
}

# Save JSON
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(final_output, f, indent=4, ensure_ascii=False)

print(f"✅ Audience + Geo trends saved to {json_path}")