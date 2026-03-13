import Habit from "../models/habit.model.js";
import { verifyHabitProof } from "../agents/vision.agent.js";

/**
 * POST /api/habits/:id/verify-proof
 *
 * Accepts a multipart/form-data request with an image file.
 * Passes the image to the Vision Agent for Gemini verification.
 * On approval  → marks the habit as complete (same logic as completeHabit).
 * On rejection → returns the sarcastic comment without touching the DB.
 *
 * Expected request: multipart/form-data
 *   - Field: "proof"  (the image file — JPEG, PNG, or WEBP)
 *
 * Uses multer with memoryStorage so we never touch the disk.
 * The base64 conversion happens in-memory before sending to Gemini.
 */
export const verifyAndCompleteHabit = async (req, res) => {
  try {
    // multer attaches the file to req.file
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded. Attach a proof image." });
    }

    const { id } = req.params;
    const userId = req.user._id;

    // Find the habit and confirm ownership
    const habit = await Habit.findOne({ _id: id, userId });
    console.log("Looking for habit:", id, "userId:", userId, typeof userId);
    if(!habit)
        console.log("not finding")
    if (!habit) {
      return res.status(404).json({ error: "Habit not found." });
    }

    // Convert buffer → base64 for Gemini inlineData
    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype; // e.g. "image/jpeg"

    // Allowed image types
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(mimeType)) {
      return res.status(400).json({
        error: "Unsupported file type. Upload a JPEG, PNG, or WEBP image.",
      });
    }

    // Send to Vision Agent
    const verdict = await verifyHabitProof(
      base64Image,
      mimeType,
      habit.title,
      habit.description
    );

    // REJECTED — return sarcasm, touch nothing
    if (!verdict.verified) {
      return res.status(200).json({
        verified: false,
        confidence: verdict.confidence,
        comment: verdict.comment,
      });
    }

    // APPROVED — update streak (mirrors your existing completeHabit logic)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyCompleted = habit.completedDates.some((d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    });

    if (alreadyCompleted) {
      return res.status(200).json({
        verified: true,
        confidence: verdict.confidence,
        comment: "Already completed today. Nice try getting double credit.",
        alreadyCompleted: true,
      });
    }

    // Add today to completedDates
    habit.completedDates.push(today);

    // Recalculate streak
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const completedYesterday = habit.completedDates.some((d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === yesterday.getTime();
    });

    habit.currentStreak = completedYesterday ? habit.currentStreak + 1 : 1;
    habit.longestStreak = Math.max(habit.longestStreak, habit.currentStreak);

    await habit.save();

    return res.status(200).json({
      verified: true,
      confidence: verdict.confidence,
      comment: verdict.comment,
      currentStreak: habit.currentStreak,
      longestStreak: habit.longestStreak,
    });
  } catch (err) {
    console.error("Proof verification error:", err);
    return res.status(500).json({
      error: "Verification failed.",
      details: err.message,
    });
  }
};