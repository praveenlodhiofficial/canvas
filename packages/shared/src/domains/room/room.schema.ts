import { z } from "zod";

/* -------------------------------- ENUM --------------------------------- */

export const RoomVisibilitySchema = z.enum(["PUBLIC", "PRIVATE"]);
export type RoomVisibility = z.infer<typeof RoomVisibilitySchema>;

/* ----------------------------- ROOM ------------------------------ */

export const RoomSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(3),
  visibility: RoomVisibilitySchema.default("PRIVATE"),
  description: z.string().optional(),
  totalMembers: z.number().int().nonnegative().default(1),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type RoomInput = z.input<typeof RoomSchema>;
export type Room = z.output<typeof RoomSchema>;

// --------------------------------------------> DERIVED ROOM SCHEMA <--------------------------------------------

export const CreateRoomSchema = RoomSchema.pick({
  name: true,
  visibility: true,
  description: true,
});

export const UpdateRoomSchema = RoomSchema.pick({
  id: true,
  name: true,
  description: true,
  visibility: true,
});

export const GetRoomByIdSchema = RoomSchema.pick({ id: true });
export const RenameRoomSchema = RoomSchema.pick({ id: true, name: true });
export const DeleteRoomSchema = RoomSchema.pick({ id: true });
export const ShareRoomSchema = RoomSchema.pick({ id: true });
export const JoinRoomSchema = RoomSchema.pick({ id: true });
