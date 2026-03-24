import User from "../models/user.model.js";
import Habit from "../models/habit.model.js";
import JournalEntry from "../models/journal.model.js";
import { updateSettingsSchema } from "../validators/settings.validator.js";

// GET /settings
export const getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("settings");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      data: user.settings ?? {
        weekStartDay: "monday",
        coachTone: "motivational",
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /settings
export const updateSettings = async (req, res, next) => {
  try {
    const validatedData = updateSettingsSchema.parse(req.body);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { settings: validatedData } },
      { new: true, select: "settings" }
    );

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: user.settings,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }
    next(error);
  }
};

// GET /settings/export
export const exportData = async (req, res, next) => {
  try {
    const [user, habits, journals] = await Promise.all([
      User.findById(req.user._id).select("name email createdAt settings"),
      Habit.find({ userId: req.user._id }).lean(),
      JournalEntry.find({ userId: req.user._id }).lean(),
    ]);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      account: {
        name: user.name,
        email: user.email,
        memberSince: user.createdAt,
        settings: user.settings,
      },
      habits: habits.map((h) => ({
        name: h.name,
        description: h.description,
        currentStreak: h.currentStreak,
        longestStreak: h.longestStreak,
        proofRequired: h.proofRequired,
        createdAt: h.createdAt,
      })),
      journals: journals.map((j) => ({
        content: j.content,
        sentiment: j.sentiment,
        themes: j.themes,
        createdAt: j.createdAt,
      })),
      summary: {
        totalHabits: habits.length,
        totalJournalEntries: journals.length,
      },
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="habitmind-export-${Date.now()}.json"`
    );
    res.status(200).json(exportPayload);
  } catch (error) {
    next(error);
  }
};

// DELETE /settings/account
export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await Promise.all([
      Habit.deleteMany({ userId }),
      JournalEntry.deleteMany({ userId }),
      User.findByIdAndDelete(userId),
    ]);

    res.status(200).json({
      success: true,
      message: "Account and all associated data deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};