import { z } from "zod";

export const createHabitSchema = z.object({

  title: z
    .string()
    .trim()
    .min(3, "Habit title must be at least 3 characters")
    .max(100, "Habit title cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  frequency: z
    .enum(["daily", "weekly"])
    .optional(),

  priority: z
    .enum(["low", "medium", "high"])
    .optional()

});


export const updateHabitSchema = z.object({

  title: z
    .string()
    .trim()
    .min(3)
    .max(100)
    .optional(),

  description: z
    .string()
    .trim()
    .max(500)
    .optional(),

  frequency: z
    .enum(["daily", "weekly"])
    .optional(),

  priority: z
    .enum(["low", "medium", "high"])
    .optional()

});


export const completeHabitSchema = z.object({
  date: z
    .string()
    .datetime({ message: "Invalid date format" })

});