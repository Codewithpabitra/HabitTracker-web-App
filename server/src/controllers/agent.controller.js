import { runAuditor } from "../agents/auditor.agent.js";
import { runEnforcer } from "../agents/enforcer.agent.js";

/**
 * GET /api/agents/accountability-check
 *
 * Called on every login from the frontend.
 * Runs Agent A (Auditor) → Agent B (Enforcer) in sequence.
 *
 * Response shape:
 *
 * If no broken streaks:
 *   { triggered: false }
 *
 * If broken streaks found:
 *   {
 *     triggered: true,
 *     subject: string,
 *     message: string,
 *     brokenHabits: [{ habitTitle, daysMissed, previousStreak, longestStreak }],
 *     auditedAt: ISO string
 *   }
 */
export const runAccountabilityCheck = async (req, res) => {
  try {
    const userId = req.user._id;

    // Step 1 — Agent A scans for broken streaks
    const auditPayload = await runAuditor(userId);

    if (!auditPayload) {
      return res.status(200).json({ triggered: false });
    }

    // Step 2 — Agent B drafts the personalised message
    const result = await runEnforcer(auditPayload);

    return res.status(200).json({
      triggered: true,
      subject: result.subject,
      message: result.message,
      brokenHabits: result.brokenHabits,
      auditedAt: auditPayload.auditedAt,
    });
  } catch (err) {
    console.error("Accountability check failed:", err);
    return res.status(500).json({
      error: "Accountability check failed",
      details: err.message,
    });
  }
};