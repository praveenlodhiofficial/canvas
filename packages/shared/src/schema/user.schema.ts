import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().url().nullable().optional(),
  username: z.string().min(1).max(30).nullable().optional(),
  bio: z.string().max(160).nullable().optional(),
  theme: z.enum(["light", "dark", "system"]).nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type UserType = z.infer<typeof UserSchema>;

export const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  username: z.string().min(1).max(30).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  bio: z.string().max(160).nullable().optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
