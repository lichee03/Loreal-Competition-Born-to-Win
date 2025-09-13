# ✅ Solution Delivered  
# Cross-Platform AI Trend Intelligence System  

## 1. Automated Multi-Platform Data Collection  
- TikTok, Instagram & Twitter via RapidAPI  
- YouTube video dataset integration  

## 2. Unified Data Pipeline  
- Data cleaning, normalization, and feature engineering  
- Extraction of top hashtags, trend lifecycle signals, and audience metrics  

## 3. Predictive Machine Learning Models  
- Viral video prediction across platforms  
- Early detection of emerging beauty trends  
- Forecasting the “Sweet Spot” of trends (optimal timing for engagement)  

## 4. Actionable Trend Intelligence  
- Trend lifecycle analytics for engagement planning  
- Segment-specific insights: audience demographics, product categories, geographic patterns  
- Generation of trend tables for business intelligence  

## 5. Beauty-to-Product Mapping (L’Oréal Focused)  
- Mapping beauty trends to specific L’Oréal product lines  
- Segmenting insights into actionable marketing opportunities  

## 6. Interactive AI Insights  
- Predictive insights delivered via **TrendBot AI** (chatbot)  
- Real-time interactive queries for marketers and product teams  

## 7. Business Value  
- Actionable beauty trend intelligence  
- Optimized engagement strategies  
- Enhanced product innovation and market positioning  

---

## 📊 Analysis Results  

### YouTube  
- 📺 Total Videos Analyzed: **92k+ beauty & lifestyle videos**  
- 👥 Unique Creators: **53k+ YouTube channels**  
- 📅 Coverage: **2020–2025 (5 years of trend data)**  
- 🏷️ Categories: Beauty, skincare, makeup, lifestyle, health, general  
- 💄 Products & Brands Extraction: **500+ products** and **300+ brands** extracted  

**Outputs:**  
- `youtube_clean.csv` → processed video dataset  
- `youtube_predicted_viral.csv` → AI-predicted trending videos  
- `youtube_hashtag_trends.json` → hashtag time series for lifecycle analysis  
- `youtube_beauty_products.csv` → videos with extracted product and brand  
- `trend_with_loreal_mapping_scored.csv` → trends mapped to L’Oréal product  

---

### TikTok  
- 📺 Total Videos Fetched: ~500+ across 5 countries (FR, KR, US, CN, MY)  
- 👥 Creators: 200+ trending profiles  
- 🎵 Songs: 100+ trending tracks ranked  
- 🏷️ Hashtags: 300+ hashtags captured  
- 🌍 Categories: Beauty, fashion, lifestyle, food, health  

**Outputs:**  
- `tiktok_videos_clean.csv` → enriched TikTok dataset  
- `tiktok_predicted_viral.csv` → AI-predicted trending content  
- `trend_table_from_predictions.csv` → hashtag intelligence table  
- `trend_summary_from_predictions.csv` → hashtag trend life cycle summary  

---

### Instagram  
- 📺 Total Posts Fetched: ~500+ across 6 countries  
- 👥 Creators: 200+ trending profiles  
- 💬 Keywords: 100+ trending keywords ranked  
- 🏷️ Hashtags: 100+ hashtags captured  
- 🌍 Categories: Beauty, fashion, lifestyle, food, health  

**Outputs:**  
- `trend_table_ig.csv` → enriched Instagram dataset  
- `trend_summary_ig.csv` → AI-predicted trending content  

---

### Twitter  
- 📺 Total Tweets Fetched: ~500+ across 12 countries (CH, FR, MY, TH, US, AU, DE, UK, MX, CN, IT, CA)  
- 👥 Creators: 200+ trending profiles  
- 💬 Keywords: 100+ trending keywords ranked  
- 🏷️ Hashtags: 100+ hashtags captured  
- 🌍 Categories: Beauty, fashion, lifestyle, food, health  

**Outputs:**  
- `tweet_trends_clean.csv` → enriched Twitter dataset  
- `tweet_summary_twitter.csv` → AI-predicted trending content  

---

### Others  
- 🌎 `trend_aggregated.csv` → unified multi-platform dataset  
- 🌎 `app/trendAnalysis` → Jupyter notebook for model analysis  

---

## 🧠 AI Components Built  

### 1. Data Collection  
- **YouTube:** curated dataset (92k+ videos)  
- **TikTok:** APIs via RapidAPI (creators, songs, hashtags, videos)  
- **Instagram:** APIs via RapidAPI (hashtags, creators, reels, posts, location)  
- **Twitter:** APIs via RapidAPI (hashtags, keywords, creators, tweets, location)  

### 2. Data Cleaning & Enrichment  
- Timestamp conversion, missing value handling  
- Engagement metrics:  
  - YouTube → likes + comments + favourites  
  - TikTok → likes + shares + comments + collects  
  - Instagram → likes + comments + reposts  
  - Twitter → likes + comments + share + view  
- Temporal features: upload hour, weekday, recency  
- Text features: length, sentiment analysis (TextBlob)  
- Hashtag extraction & frequency  

### 3. Feature Engineering  
- **YouTube:** views, likes, comments, favourites, text length, hashtag count, product, brands  
- **TikTok:** creator stats, song popularity, hashtag rank, sentiment, engagement  
- **Instagram:** creator stats, hashtags, timestamp, engagement  
- **Twitter:** creator stats, hashtags, keywords, timestamp, engagement  

### 4. Machine Learning  
- Model: **Random Forest Classifier**  
- Target: Viral video classification (top 20% = viral)  
- Config: `n_estimators=200`, `max_depth=10`  
- Evaluation: accuracy, classification report, feature importance  

### 5. Trend Lifecycle Analysis  
- Hashtag usage time series (YouTube)  
- Growth metrics:  
  - 7d Growth Rate  
  - Acceleration (3d momentum)  
- Classification: Emerging | Peak | Declining  
- Added `sweet_spot_days_left` signal for timing  

### 6. Trend Intelligence Pipeline  
- Extract top hashtags from predicted viral content  
- Build unified metadata table with audience, category, geography  

### 7. Trending Product & Brand Analysis  
- Model: **spaCy NER + NLTK**  
- Dataset: [Cosmetic Products Dataset (Kaggle)](https://www.kaggle.com/datasets/mfsoftworks/cosmetic-products) + custom  
- Eval:  
  - Overall F1 = 0.958  
  - BRAND F1 = 0.965  
  - PRODUCT F1 = 0.951  

### 8. L’Oréal Product Mapping  
- Model: **Fuzzy Matching**  
- Features: L’Oréal products, descriptions, hashtags, trends  
- Eval: relevance score >50  

### 9. TrendBot AI  
- Model: **Gemini 2.0 Flash**  
- Target: Predictive insights chatbot for campaigns & product launches  

---

## 💎 Key Insights  
- 📈 **Prediction Accuracy:** Random Forest + spaCy + Fuzzy Matching = reliable predictions  
- 🏷️ **Hashtags:** Early-stage hashtags = strongest growth  
- 🎵 **TikTok Songs:** Trending audio drives virality  
- 👥 **Creators:** Top-tier creators amplify trends  
- 🔹 **L’Oréal Products:** Align campaigns with trending products  
- 🔹 **Brands:** Enable collaboration opportunities  
- ⏰ **Timing:** Evening uploads (7 PM) maximize reach  

---

## 🔧 Tech Stack  
- **Language:** Python 3.9+  
- **Data Sources:** TikTok, YouTube, Instagram, Twitter  
- **Processing:** Pandas, NumPy  
- **Text:** Regex, TextBlob, Langdetect, NLTK  
- **NLP:** spaCy, Fuzzy Matching  
- **ML:** scikit-learn (Random Forest)  
- **Storage:** CSV + JSON  

---

## ⚙️ To Run  

```bash
npm run install:all
npm run start:all
