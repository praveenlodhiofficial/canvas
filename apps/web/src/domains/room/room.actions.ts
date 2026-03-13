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
  updateRoom,
} from "@/domains/room/room.dal";
import {
  CreateRoomSchema,
  GetRoomByIdSchema,
  DeleteRoomSchema,
  RenameRoomSchema,
  JoinRoomSchema,
  ShareRoomSchema,
  RoomMember,
  RoomInput,
  UpdateRoomSchema,
} from "@repo/shared/schema";
import { CreateRoomResult, GetAllRoomsResult, GetRoomByIdResult, RenameRoomResult, ShareRoomResult, GetMemberRoomsResult, DeleteRoomResult, UpdateRoomResult } from "./room.types";

// --------------------------------------------> CREATE ROOM ACTION <--------------------------------------------

export const createRoomAction = async (
  input: Pick<RoomInput, "name" | "description" | "visibility">
): Promise<CreateRoomResult> => {
  try {
    const { name, description, visibility } = CreateRoomSchema.parse(input);
    const result = await createRoom({ name, description, visibility });

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

// --------------------------------------------> UPDATE ROOM ACTION <--------------------------------------------

export const updateRoomAction = async (
  id: string,
  input: Pick<RoomInput, "name" | "description" | "visibility">
): Promise<UpdateRoomResult> => {
  try {
    const { name, description, visibility } = UpdateRoomSchema.parse(input as Pick<RoomInput, "name" | "description" | "visibility">);
    const result = await updateRoom(id, { name, description, visibility });

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
      message: error instanceof Error ? error.message : "Invalid room data",
    };
  }
};
// --------------------------------------------> DELETE ROOM ACTION <--------------------------------------------

export const deleteRoomAction = async (
  input: Pick<RoomInput, "id">
): Promise<DeleteRoomResult> => {
  try {
    const { id } = DeleteRoomSchema.parse(input as Pick<RoomInput, "id">);
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

export const getAllRoomsAction = async (): Promise<GetAllRoomsResult> => {
  try {
    const rooms = await getAllRooms();

    if (!rooms) {
      return {
        success: false,
        message: "No rooms found",
      };
    }

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

export const getRoomByIdAction = async (
  input: Pick<RoomInput, "id">
): Promise<GetRoomByIdResult> => {
  try {
    const { id } = GetRoomByIdSchema.parse(input as Pick<RoomInput, "id">);
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



export const renameRoomAction = async (
  input: Pick<RoomInput, "id" | "name">
): Promise<RenameRoomResult> => {
  try {
    const { id, name } = RenameRoomSchema.parse(input as Pick<RoomInput, "id" | "name">);
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

export const shareRoomAction = async (
  input: Pick<RoomInput, "id">
): Promise<ShareRoomResult> => {
  try {
    const { id } = ShareRoomSchema.parse(input as Pick<RoomInput, "id">);
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
  input: Pick<RoomInput, "id">
): Promise<JoinRoomResult> => {
  try {
    const { id } = JoinRoomSchema.parse(input as Pick<RoomInput, "id">);
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


export const getMemberRoomsAction = async (): Promise<GetMemberRoomsResult> => {
  try {
    const { rooms, message } = await getMemberRooms();
    return { success: true, rooms, message };
  } catch {
    return { success: false, message: "Failed to load collaborative rooms" };
  }
};
