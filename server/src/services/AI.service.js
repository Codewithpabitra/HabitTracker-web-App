import dotenv from "dotenv"
dotenv.config()
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeJournal = async (content) => {
  try {
    const prompt = `
Analyze this journal entry and extract:
1. Sentiment (Positive, Anxious, Lethargic, Neutral)
2. Key Themes (short list of 2-5 key themes)
Return JSON only, no markdown, no explanation. Format:
{"sentiment":"Positive","themes":["Work","Family"]}
Journal Content: """${content}"""
`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    const raw = response.text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(raw);
    console.log(data)
    return {
      sentiment: data.sentiment || "Neutral",
      themes: data.themes || [],
    };
  } catch (err) {
    console.error("AI analysis failed:", err);
    return { sentiment: "Neutral", themes: [] };
  }
};

