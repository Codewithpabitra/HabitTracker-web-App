import Habit from "../models/habit.model.js";
import User from "../models/user.model.js"
import { sendStreakMilestoneEmail } from "../services/email.service.js"
import {
  createHabitSchema,
  updateHabitSchema,
} from "../validators/habit.validator.js";

export const createHabit = async (req, res, next) => {
  try {
    const validatedData = createHabitSchema.parse(req.body);
    const { title, description, frequency, priority } = validatedData;

    const existing = await Habit.findOne({
      userId: req.user,
      title,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Habit already exists",
      });
    }

    const habit = await Habit.create({
      userId: req.user,
      title,
      description,
      frequency,
      priority,
    });

    res.status(201).json({
      success: true,
      message: "Habit created successfully",
      data: habit,
    });
  } catch (e) {
    console.error("error is creating habit: ", e);
    if (e.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: e.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }

    next(e);
  }
};


export const getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ userId: req.user }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: habits,
    });
  } catch (e) {
    console.error("Error fetching habits from DB : ", e);
    next(e);
  }
};


export const updateHabit = async (req, res, next) => {
  try {
    const validatedData = updateHabitSchema.parse(req.body);
    const habit = await Habit.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user,
      },
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Habit updated successfully",
      data: habit,
    });
  } catch (e) {
    console.error("Error in updating habit :", e);
    if (e.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: e.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }

    next(e);
  }
};

export const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.user,
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Habit deleted successfully",
    });
  } catch (e) {
    console.error("Error in deleting habit : ", e);
    next(e);
  }
};


export const completeHabit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);

    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found"
      });
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // check if already completed today
    const alreadyCompleted = habit.completedDates.some(date => {
      const d = new Date(date);
      d.setHours(0,0,0,0);
      return d.getTime() === today.getTime();
    });

    if (alreadyCompleted) {
      return res.status(400).json({
        success: false,
        message: "Habit already completed today"
      });
    }

    // check if yesterday was completed
    const completedYesterday = habit.completedDates.some(date => {
      const d = new Date(date);
      d.setHours(0,0,0,0);
      return d.getTime() === yesterday.getTime();
    });

    if (completedYesterday) {
      habit.currentStreak += 1;
    } else {
      habit.currentStreak = 1;
    }

    // update longest streak
    if (habit.currentStreak > habit.longestStreak) {
      habit.longestStreak = habit.currentStreak;
    }

    habit.completedDates.push(today);

    await habit.save();

    // auto 10 day streak mail
    if (habit.streak % 10 === 0) {

  await sendStreakMilestoneEmail(
    user.email,
    user.name,
    habit.streak
  )
}

    res.status(200).json({
      success: true,
      message: "Habit completed for today",
      data: habit
    });

  } catch (e) {
    console.error("Error in complete a habit", e);
    next(e);
  }
};
