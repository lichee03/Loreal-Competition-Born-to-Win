import express from "express";
import { askGemini } from "../controllers/geminiController.js";

const router = express.Router();

router.post("/gemini", askGemini);

export default router;
