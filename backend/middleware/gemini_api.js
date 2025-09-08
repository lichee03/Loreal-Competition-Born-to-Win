const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const geminiRoutes = require("../routes/geminiRoutes");
app.use("/api", geminiRoutes);

const PORT = process.env.PORT || 5001;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Gemini API server running on port ${PORT}`);
  });
}

module.exports = app;
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

