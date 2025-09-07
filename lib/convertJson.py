import pandas as pd
import os

# folder where your CSVs live
data_folder = os.path.join("app", "data")

# loop through all files in app/data
for filename in os.listdir(data_folder):
    if filename.endswith(".csv"):
        csv_path = os.path.join(data_folder, filename)
        json_path = os.path.join(
            data_folder, filename.replace(".csv", ".json")
        )

        # read csv
        df = pd.read_csv(csv_path)

        # convert to JSON (list of objects)
        df.to_json(json_path, orient="records", indent=2)

        print(f"Converted {filename} → {os.path.basename(json_path)}")
