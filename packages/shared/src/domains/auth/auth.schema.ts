import { z } from "zod";

import { UserSchema } from "../user/user.schema";

export const SignUpSchema = UserSchema.pick({
  name: true,
  email: true,
}).extend({
  password: z.string().min(6),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: UserSchema.shape.email,
  password: z.string().min(6),
});

export type SignInInput = z.infer<typeof SignInSchema>;
