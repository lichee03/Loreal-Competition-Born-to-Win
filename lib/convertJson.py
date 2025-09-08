import pandas as pd
import os

# input CSV path
csv_path = os.path.join("app", "data", "trend_with_loreal_mapping.csv")

# output JSON path
json_path = os.path.join("public", "trend_with_loreal_mapping.json")

# read CSV with Windows-1252 encoding (fix for UnicodeDecodeError)
df = pd.read_csv(csv_path, encoding="cp1252")

# convert to JSON (list of objects)
df.to_json(json_path, orient="records", indent=2)

print(f"Converted {os.path.basename(csv_path)} → {os.path.basename(json_path)}")
