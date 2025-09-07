import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
import os
import re

INPUT_FILE = os.path.join("app", "data", "tweet_trends.csv")
OUTPUT_FILE = os.path.join("app", "data", "tweet_trends_classified.csv")

train_data = [
    ("fashion week", "lifestyle"), ("travel vlog", "lifestyle"), ("celebrity news", "lifestyle"),
    ("pizza", "food"), ("coffee", "food"), ("restaurant", "food"), ("recipe", "food"),
    ("football", "sports"), ("nba", "sports"), ("soccer", "sports"), ("tennis", "sports"),
    ("workout", "health"), ("covid", "health"), ("yoga", "health"), ("diet", "health"),
    ("makeup", "beauty"), ("skincare", "beauty"), ("lipstick", "beauty"), ("perfume", "beauty"),
]

train_texts, train_labels = zip(*train_data)

model = make_pipeline(TfidfVectorizer(), MultinomialNB())
model.fit(train_texts, train_labels)

def fallback_rules(text):
    text_lower = text.lower()
    if re.search(r"(sport|football|nba|soccer|tennis|basketball)", text_lower):
        return "sports"
    if re.search(r"(food|pizza|drink|coffee|recipe|cook)", text_lower):
        return "food"
    if re.search(r"(health|covid|fitness|yoga|workout)", text_lower):
        return "health"
    if re.search(r"(beauty|makeup|skincare|lipstick|perfume|hair)", text_lower):
        return "beauty"
    if re.search(r"(fashion|travel|lifestyle|vlog|celebrity)", text_lower):
        return "lifestyle"
    return "lifestyle"  # default

df = pd.read_csv(INPUT_FILE)

preds = []
for text in df["trend_id"].astype(str):
    proba = model.predict_proba([text])[0]
    max_prob = proba.max()
    pred = model.predict([text])[0]
    # fallback if low confidence
    if max_prob < 0.6:
        pred = fallback_rules(text)
    preds.append(pred)

df["category"] = preds
df.to_csv(OUTPUT_FILE, index=False, encoding="utf-8")

print(f"✅ Classified trends with hybrid logic saved to {OUTPUT_FILE}")
