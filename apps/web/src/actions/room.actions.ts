"use server";

import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
  joinRoom,
  shareRoom,
  renameRoom,
  getMemberRooms,
} from "@/dal/room.dal";
import {
  CreateRoomSchema,
  GetRoomByIdSchema,
  DeleteRoomSchema,
  RenameRoomSchema,
  type Room,
  JoinRoomSchema,
  ShareRoomSchema,
  RoomMember,
} from "@repo/shared/schema";

// --------------------------------------------> CREATE ROOM ACTION <--------------------------------------------

type CreateRoomResult =
  | { success: true; message: string; room: Room }
  | { success: false; message: string };

export const createRoomAction = async (
  input: unknown
): Promise<CreateRoomResult> => {
  try {
    const { name } = CreateRoomSchema.parse(input);
    const result = await createRoom({ name });

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return {
      success: true,
      message: result.message,
      room: result.room,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Invalid room data",
    };
  }
};

// --------------------------------------------> DELETE ROOM ACTION <--------------------------------------------

type DeleteRoomResult =
  | { success: true; message: string }
  | { success: false; message: string };

export const deleteRoomAction = async (
  input: unknown
): Promise<DeleteRoomResult> => {
  try {
    const { id } = DeleteRoomSchema.parse(input);
    const result = await deleteRoom(id);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Invalid room id",
    };
  }
};

// --------------------------------------------> GET ALL ROOMS ACTION <--------------------------------------------

type GetAllRoomsResult =
  | { success: true; rooms: Room[] }
  | { success: false; message: string };

export const getAllRoomsAction = async (): Promise<GetAllRoomsResult> => {
  try {
    const rooms = await getAllRooms();

    return {
      success: true,
      rooms,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to fetch rooms",
    };
  }
};

// --------------------------------------------> GET ROOM BY ID ACTION <--------------------------------------------

type GetRoomByIdResult =
  | { success: true; room: Room }
  | { success: false; message: string };

export const getRoomByIdAction = async (
  input: unknown
): Promise<GetRoomByIdResult> => {
  try {
    const { id } = GetRoomByIdSchema.parse(input);
    const room = await getRoomById(id!);

    if (!room) {
      return {
        success: false,
        message: "Room not found",
      };
    }

    return {
      success: true,
      room,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Invalid room id",
    };
  }
};

// --------------------------------------------> RENAME ROOM ACTION <--------------------------------------------

type RenameRoomResult =
  | { success: true; message: string; name: string; previousName: string }
  | { success: false; message: string };

export const renameRoomAction = async (
  input: unknown
): Promise<RenameRoomResult> => {
  try {
    const { id, name } = RenameRoomSchema.parse(input);
    const result = await renameRoom({ id, name });

    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }

    return {
      success: true,
      message: result.message,
      name: result.name,
      previousName: result.previousName,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Invalid rename payload",
    };
  }
};

// --------------------------------------------> SHARE ROOM ACTION <--------------------------------------------

type ShareRoomResult =
  | { success: true; message: string; room: Room }
  | { success: false; message: string };

export const shareRoomAction = async (
  input: unknown
): Promise<ShareRoomResult> => {
  try {
    const { id } = ShareRoomSchema.parse(input);
    const result = await shareRoom(id!);

    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }

    return {
      success: true,
      message: result.message,
      room: result.room,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Invalid room id",
    };
  }
};

// --------------------------------------------> JOIN ROOM ACTION <--------------------------------------------

type JoinRoomResult =
  | { success: true; message: string; member: RoomMember; roomId: string }
  | { success: false; message: string };

export const joinRoomAction = async (
  input: unknown
): Promise<JoinRoomResult> => {
  try {
    const { id } = JoinRoomSchema.parse(input);
    const result = await joinRoom(id!);

    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }

    return {
      success: true,
      message: result.message,
      member: result.member,
      roomId: result.roomId,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Invalid room id",
    };
  }
};

// --------------------------------------------> FETCH MEMBER'S ROOMS ACTION <--------------------------------------------

type GetMemberRoomsResult =
  | { success: true; rooms: Room[]; message: string }
  | { success: false; message: string };

export const getMemberRoomsAction = async (): Promise<GetMemberRoomsResult> => {
  try {
    const { rooms, message } = await getMemberRooms();
    return { success: true, rooms, message };
  } catch {
    return { success: false, message: "Failed to load collaborative rooms" };
  }
};
