import pandas as pd
import os

# input CSV path
csv_path = os.path.join("app", "data", "trend_aggregated.csv")

# output JSON path
json_path = os.path.join("public", "trend_aggregated.json")

# safest option: utf-8 with errors ignored
df = pd.read_csv(csv_path, encoding="latin1")



# convert to JSON (list of objects)
df.to_json(json_path, orient="records", indent=2)

print(f"Converted {os.path.basename(csv_path)} → {os.path.basename(json_path)}")
