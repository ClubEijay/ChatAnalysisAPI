// Vercel Serverless Function handler for the same endpoint
import { analyzeMessageWithOpenAI } from "../src/analyzer.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message } = req.body || {};
    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "'message' is required in JSON body" });
    }
    const result = await analyzeMessageWithOpenAI(message.trim());
    return res.status(200).json(result);
  } catch (error) {
    const isAuthError =
      error && typeof error.message === "string" && error.message.includes("OPENAI_API_KEY");
    const status = isAuthError ? 500 : 502;
    return res.status(status).json({ error: "Failed to analyze message", details: error.message });
  }
}


