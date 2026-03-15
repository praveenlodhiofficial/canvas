import type { Room, RoomInput, RoomMember } from "@repo/shared/schema";

import { authFetch } from "@/lib/auth/auth-fetch";
import { config } from "@/lib/config";

import type { MemberRoom } from "./room.types";
import { CreateRoomResult, UpdateRoomResult } from "./room.types";

/* ====================================== CREATE ROOM ====================================== */
export const createRoom = async (
  room: Pick<RoomInput, "name" | "description" | "visibility">
): Promise<CreateRoomResult> => {
  try {
    const data = await authFetch<{
      message: string;
      room: Room;
    }>(`${config.httpUrl}/api/v1/rooms`, {
      method: "POST",
      body: JSON.stringify(room),
    });

    return {
      success: true,
      message: data.message,
      room: data.room,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to create room" };
  }
};

/* ====================================== UPDATE ROOM ====================================== */
export const updateRoom = async (
  id: string,
  room: Pick<RoomInput, "name" | "description" | "visibility">
): Promise<UpdateRoomResult> => {
  try {
    const data = await authFetch<{
      success: boolean;
      message: string;
    }>(`${config.httpUrl}/api/v1/rooms/${id}`, {
      method: "PUT",
      body: JSON.stringify(room),
    });
    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update room" };
  }
};

/* ====================================== GET ALL ROOMS ====================================== */
export const getAllRooms = async (): Promise<Room[]> => {
  const data = await authFetch<{
    message: string;
    rooms: Room[];
  }>(`${config.httpUrl}/api/v1/rooms`);

  return data.rooms;
};

/* ====================================== GET ROOM BY ID ====================================== */
export const getRoomById = async (id: string): Promise<Room | null> => {
  try {
    const data = await authFetch<{
      message: string;
      room: Room;
    }>(`${config.httpUrl}/api/v1/rooms/${id}`);

    return data.room;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/* ====================================== DELETE ROOM ====================================== */
export const deleteRoom = async (
  id: RoomInput["id"]
): Promise<
  { success: true; message: string } | { success: false; message: string }
> => {
  try {
    const data = await authFetch<{
      message: string;
    }>(`${config.httpUrl}/api/v1/rooms/${id}`, {
      method: "DELETE",
    });

    return { success: true, message: data.message };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete room" };
  }
};

/* ====================================== RENAME ROOM ====================================== */
export const renameRoom = async (
  room: Pick<RoomInput, "id" | "name">
): Promise<
  | { success: true; message: string; name: string; previousName: string }
  | { success: false; message: string }
> => {
  try {
    const data = await authFetch<{
      message: string;
      name: string;
      previousName: string;
    }>(`${config.httpUrl}/api/v1/rooms/${room.id}/rename`, {
      method: "POST",
      body: JSON.stringify(room),
    });

    return {
      success: true,
      message: data.message,
      name: data.name,
      previousName: data.previousName,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to rename room" };
  }
};

/* ====================================== SHARE ROOM ====================================== */
export const shareRoom = async (
  roomId: string
): Promise<
  | { success: true; message: string; room: Room }
  | { success: false; message: string }
> => {
  try {
    const data = await authFetch<{
      message: string;
      room: Room;
    }>(`${config.httpUrl}/api/v1/rooms/${roomId}/share`, {
      method: "POST",
    });

    return {
      success: true,
      message: data.message,
      room: data.room,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to share room" };
  }
};

/* ====================================== JOIN ROOM ====================================== */
export const joinRoom = async (
  roomId: string
): Promise<
  | { success: true; message: string; member: RoomMember; roomId: string }
  | { success: false; message: string }
> => {
  try {
    const data = await authFetch<{
      message: string;
      member: RoomMember;
      roomId: string;
    }>(`${config.httpUrl}/api/v1/rooms/${roomId}/join`, {
      method: "POST",
    });

    return {
      success: true,
      message: data.message,
      roomId: data.roomId,
      member: data.member,
    };
  } catch {
    return { success: false, message: "Failed to join room" };
  }
};

/* ====================================== FETCH MEMBER'S ROOMS ====================================== */
export const getMemberRooms = async (): Promise<{
  rooms: MemberRoom[];
  message: string;
}> => {
  try {
    const data = await authFetch<{
      message: string;
      rooms: MemberRoom[];
    }>(`${config.httpUrl}/api/v1/rooms/member`);

    return { rooms: data.rooms, message: data.message };
  } catch {
    return { rooms: [], message: "Failed to load collaborative rooms" };
  }
};
