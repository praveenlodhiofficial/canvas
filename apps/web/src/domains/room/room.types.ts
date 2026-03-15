import type { Room } from "@repo/shared/schema";

export type MemberRoom = Room & { isOwner: boolean };

export type CreateRoomResult =
  | { success: true; message: string; room: Room }
  | { success: false; message: string };

export type UpdateRoomResult =
  | { success: true; message: string }
  | { success: false; message: string };

export type GetAllRoomsResult =
  | { success: true; rooms: Room[] }
  | { success: false; message: string };

export type GetRoomByIdResult =
  | { success: true; room: Room }
  | { success: false; message: string };

export type DeleteRoomResult =
  | { success: true; message: string }
  | { success: false; message: string };

export type RenameRoomResult =
  | { success: true; message: string; name: string; previousName: string }
  | { success: false; message: string };

export type ShareRoomResult =
  | { success: true; message: string; room: Room }
  | { success: false; message: string };

export type GetMemberRoomsResult =
  | { success: true; rooms: MemberRoom[]; message: string }
  | { success: false; message: string };
