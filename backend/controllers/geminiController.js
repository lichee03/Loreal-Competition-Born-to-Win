import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const CSV_PATH = path.join(process.cwd(), "../app/data/trend_both_youtube_updated.csv");

// Helper: Load CSV and return as array of objects (first 10 rows for brevity)
function loadCsvData() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on("data", (data) => {
        if (results.length < 10) results.push(data);
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

export async function askGemini(req, res) {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const csvData = await loadCsvData();
    // Add instruction for plain, short output
    const context = `Here is some trend data:\n${JSON.stringify(csvData, null, 2)}\n
When you answer, reply in plain text only (no Markdown, no bold), and keep your answer as short and concise as possible for chatbot display. Give two new lines for every new sentence for nice format.
User question: ${prompt}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(context);
    const response = await result.response;
    const text = response.text();

    res.json({ result: text });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}
