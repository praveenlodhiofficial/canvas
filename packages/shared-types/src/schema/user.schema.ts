import { z } from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
})

export type UserType = z.infer<typeof UserSchema>