import { z } from "zod";


export const createJournalSchema = z.object({
  title: z
    .string()
    .trim()
    .max(120, "Title cannot exceed 120 characters")
    .optional(),

  content: z
    .string()
    .trim()
    .min(10, "Journal entry must be at least 10 characters")
    .max(5000, "Journal entry cannot exceed 5000 characters"),

  mood: z
    .enum(["happy", "neutral", "sad", "productive", "stressed"])
    .optional()
});


export const updateJournalSchema = z.object({

  title: z
    .string()
    .trim()
    .max(120)
    .optional(),

  content: z
    .string()
    .trim()
    .min(10)
    .max(5000)
    .optional(),

  mood: z
    .enum(["happy", "neutral", "sad", "productive", "stressed"])
    .optional()

});