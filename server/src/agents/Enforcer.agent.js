import Journal from "../models/journal.model.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * AGENT B — THE ENFORCER
 *
 * Receives the auditor payload. Pulls the user's last 10 journal entries
 * to find their stated goals and motivations. Sends everything to Gemini
 * to generate a highly personalised, sharp accountability message.
 *
 * Returns: { subject, message, brokenHabits }
 */
export const runEnforcer = async (auditPayload) => {
  const { userId, brokenHabits } = auditPayload;

  const journals = await Journal.find({ userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .select("title content mood createdAt");

  const journalContext =
    journals.length > 0
      ? journals
          .map(
            (j, i) =>
              `Entry ${i + 1} (${new Date(j.createdAt).toDateString()}) [Mood: ${j.mood}]:\nTitle: ${j.title || "Untitled"}\n${j.content}`
          )
          .join("\n\n---\n\n")
      : "No journal entries found.";

  const habitContext = brokenHabits
    .map(
      (h) =>
        `- "${h.habitTitle}" (was on a ${h.previousStreak}-day streak, missed for ${h.daysMissed} days)`
    )
    .join("\n");

  const prompt = `
You are The Enforcer — a brutally honest, slightly unhinged accountability coach.
Your job is to shame and re-motivate a user who has broken their habit streaks.

Use specific references from their journal entries to make the message feel deeply personal.
Be direct, a little dramatic, but ultimately motivating. No fluff. No emojis.
Do NOT be abusive or harmful. The goal is a gut-punch of motivation.

BROKEN HABITS:
${habitContext}

USER'S RECENT JOURNAL ENTRIES:
${journalContext}

Return ONLY a valid JSON object. No markdown, no backticks, no explanation. Format:
{
  "subject": "short punchy subject line (max 10 words)",
  "message": "the full accountability message (2-4 sentences, personal and sharp)"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const raw = response.text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw);

    return {
      subject: parsed.subject || "You broke your streak. We need to talk.",
      message:
        parsed.message ||
        "You've been slipping. Your journal says otherwise. Get back on track.",
      brokenHabits,
    };
  } catch (err) {
    console.error("Enforcer AI generation failed:", err);
    // Graceful fallback if Gemini fails
    return {
      subject: "Your streak is broken. No excuses.",
      message: `You haven't completed ${brokenHabits.map((h) => `"${h.habitTitle}"`).join(", ")} in ${brokenHabits[0]?.daysMissed || 2}+ days. Your past self had goals. Your present self has excuses. Which one wins?`,
      brokenHabits,
    };
  }
};