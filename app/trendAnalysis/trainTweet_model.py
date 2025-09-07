import pandas as pd
import os

# --- Load your dataset ---
file_path = os.path.join(os.path.dirname(__file__), "tweet_trends_classified.csv")
df = pd.read_csv(file_path)

# --- Calculate Growth Metrics ---
df["growth_rate_7d"] = df["engagement"] / (df["volume"] + 1)  # engagement vs volume
df["acceleration"] = df["growth_rate_7d"] / (df["growth_rate_7d"].mean() + 1e-6)
df["sweet_spot_days_left"] = (1 / (df["volume"] + 1)) * df["engagement"]

# --- Define Stage Logic ---
def get_stage(row):
    if row["growth_rate_7d"] > 5:  
        return "emerging"
    elif row["acceleration"] > 1.2:  
        return "peak"
    else:
        return "stable"

df["current_stage"] = df.apply(get_stage, axis=1)

# --- Recommendation Logic (based on stage) ---
def recommend(stage):
    if stage == "emerging":
        return "Hop in now"
    elif stage == "peak":
        return "Leverage while peak"
    else:
        return "Maintain position"

df["recommended_actions"] = df["current_stage"].apply(recommend)

# --- Create Summary Table ---
summary = df[[
    "trend_id",
    "volume",
    "engagement",
    "unique_creators",
    "current_stage",        
    "growth_rate_7d",
    "acceleration",
    "sweet_spot_days_left",
    "recommended_actions"
]]

# --- Save to CSV ---
output_path = os.path.join(os.path.dirname(__file__), "trend_summary_twitter.csv")
summary.to_csv(output_path, index=False)

print(f"✅ Done! Saved trend summary to: {output_path}")
print(summary.head())
