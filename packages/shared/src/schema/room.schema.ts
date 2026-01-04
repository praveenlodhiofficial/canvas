import { z } from "zod";

export const RoomSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type RoomType = z.infer<typeof RoomSchema>;
