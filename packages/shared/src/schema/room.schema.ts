import { z } from "zod";

export const RoomSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
});

export type RoomType = z.infer<typeof RoomSchema>;
