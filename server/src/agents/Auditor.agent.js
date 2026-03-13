import Habit from "../models/habit.model.js";

/**
 * AGENT A — THE AUDITOR
 *
 * Scans habits for the given user. If any habit has not been completed
 * in the last 2 days but previously had a streak, it is flagged as broken.
 * Returns null if no broken streaks are found (no intervention needed).
 */
export const runAuditor = async (userId) => {
  const now = new Date();
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(now.getDate() - 2);
  twoDaysAgo.setHours(0, 0, 0, 0);

  const habits = await Habit.find({ userId, currentStreak: { $gt: 0 } });

  const brokenHabits = [];

  for (const habit of habits) {
    if (!habit.completedDates || habit.completedDates.length === 0) continue;

    const sortedDates = habit.completedDates
      .map((d) => new Date(d))
      .sort((a, b) => b - a);

    const lastCompleted = sortedDates[0];

    if (lastCompleted < twoDaysAgo) {
      const daysMissed = Math.floor(
        (now - lastCompleted) / (1000 * 60 * 60 * 24)
      );
      brokenHabits.push({
        habitId: habit._id,
        habitTitle: habit.title,
        habitDescription: habit.description,
        previousStreak: habit.currentStreak,
        longestStreak: habit.longestStreak,
        daysMissed,
        lastCompleted: lastCompleted.toISOString(),
      });
    }
  }

  if (brokenHabits.length === 0) return null;

  return {
    userId,
    brokenHabits,
    auditedAt: now.toISOString(),
  };
};