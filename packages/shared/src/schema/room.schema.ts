import { z } from "zod";

export const RoomSchema = z.object({
  name: z.string().min(3),
});

export type RoomType = z.infer<typeof RoomSchema>;
