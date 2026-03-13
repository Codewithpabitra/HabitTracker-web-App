import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const getClassifiedWords = async (pageText) => {
  const prompt = `
You are a paranoid government AI. Read the following text and pick 8-15 random 
non-essential words that you have decided are "classified." 
Pick a random mix — nouns, adjectives, the occasional verb. Be unpredictable.
Do NOT pick: names, numbers, dates, or any word shorter than 4 letters.

Return ONLY a JSON array of the exact words as they appear in the text. 
No markdown, no explanation.
Example: ["morning","healthy","running","decided"]

TEXT:
"""${pageText}"""
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const raw = response.text.replace(/```json|```/g, "").trim();
  return JSON.parse(raw);
};