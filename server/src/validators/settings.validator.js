import { z } from "zod";

export const updateSettingsSchema = z.object({
  weekStartDay: z
    .enum(["monday", "sunday"], {
      errorMap: () => ({ message: "weekStartDay must be 'monday' or 'sunday'" }),
    })
    .optional(),

  coachTone: z
    .enum(["motivational", "neutral", "ruthless"], {
      errorMap: () => ({ message: "coachTone must be 'motivational', 'neutral', or 'ruthless'" }),
    })
    .optional(),
});