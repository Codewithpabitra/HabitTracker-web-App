import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * VISION AGENT — PROOF VERIFIER
 *
 * Sends the uploaded image + habit context to Gemini's vision model.
 * Returns a structured verdict: approved or rejected, with a comment.
 *
 * @param {string} base64Image   - Pure base64 string (no data URI prefix)
 * @param {string} mimeType      - e.g. "image/jpeg", "image/png", "image/webp"
 * @param {string} habitTitle    - e.g. "Eat Healthy"
 * @param {string} habitDesc     - e.g. "Have a nutritious meal with vegetables"
 *
 * @returns {Object} {
 *   verified: boolean,
 *   confidence: "high" | "medium" | "low",
 *   comment: string   — sarcastic if rejected, encouraging if approved
 * }
 */
export const verifyHabitProof = async (
  base64Image,
  mimeType,
  habitTitle,
  habitDesc
) => {
  const prompt = `
You are a brutally honest habit verification AI. Your job is to look at the image and decide if it proves the user completed their habit.

HABIT: "${habitTitle}"
DESCRIPTION: "${habitDesc || "No additional description provided."}"

Your task:
1. Look at the image carefully.
2. Decide if the image is plausible proof that the habit was completed.
3. Be strict but fair. A salad proves "Eat Healthy". A donut does NOT.
4. If the image is completely unrelated or clearly fake, reject it.

Return ONLY a valid JSON object. No markdown, no backticks, no explanation whatsoever.
{
  "verified": 1,
  "confidence": "high",
  "comment": "Short comment (1-2 sentences). Sarcastic and funny if rejected. Warm and motivating if approved."
}

Rules:
- "verified" must be exactly 1 (approved) or 0 (rejected). Nothing else.
- "confidence" must be "high", "medium", or "low".
- "comment" must always reference what you actually SEE in the image to feel personal.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Image,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    const raw = response.text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw);

    // Sanitize — enforce strict binary
    const verified = parsed.verified === 1 || parsed.verified === true;

    return {
      verified,
      confidence: ["high", "medium", "low"].includes(parsed.confidence)
        ? parsed.confidence
        : "medium",
      comment:
        parsed.comment ||
        (verified
          ? "Looks good. Streak updated."
          : "That doesn't look right. Try again with actual proof."),
    };
  } catch (err) {
    console.error("Vision verification failed:", err);
    // Fail safe — don't approve on error
    return {
      verified: false,
      confidence: "low",
      comment:
        "Our verification system had a moment. Please try uploading again.",
    };
  }
};