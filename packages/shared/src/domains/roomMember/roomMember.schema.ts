import { z } from "zod";

import { RoomSchema } from "../room/room.schema";
import { UserSchema } from "../user/user.schema";

/* -------------------------------- ENUM --------------------------------- */

export const RoomRoleSchema = z.enum(["ADMIN", "MEMBER"]);
export type RoomRole = z.infer<typeof RoomRoleSchema>;

/* ----------------------------- ROOM MEMBER ------------------------------ */

export const RoomMemberSchema = z.object({
  id: z.uuid().optional(),

  roomId: z.uuid(),
  userId: z.uuid(),

  role: RoomRoleSchema.default("MEMBER"),

  joinedAt: z.date().optional(),

  user: UserSchema.optional(),
  room: RoomSchema.optional(),
});

export type RoomMember = z.infer<typeof RoomMemberSchema>;
