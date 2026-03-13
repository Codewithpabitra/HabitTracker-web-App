import { z } from "zod";

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name cannot exceed 50 characters")
      .optional(),

    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters")
      .optional(),

    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
  })
  .refine((data) => !(data.newPassword && !data.currentPassword), {
    message: "Current password is required when setting a new password",
    path: ["currentPassword"],
  });