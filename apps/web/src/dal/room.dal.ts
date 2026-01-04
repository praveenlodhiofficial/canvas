import { authFetch } from "@/lib/auth/auth-fetch";
import { config } from "@/lib/config";
import { RoomType } from "@repo/shared/schema";
import { cache } from "react";
import { toast } from "sonner";

export const getAllRooms = cache(async () => {
  const data = await authFetch<{
    message: string;
    rooms: RoomType[];
  }>(`${config.backendUrl}/api/v1/rooms`);

  if (!data.message) {
    toast.error(data.message);
    return;
  }

  return data.rooms.map((room) => ({
    id: room.id,
    name: room.name,
    updatedAt: room.updatedAt,
  }));
});

export const getRoomById = cache(async (id: string) => {
  const data = await authFetch<{
    message: string;
    room: RoomType;
  }>(`${config.backendUrl}/api/v1/rooms/${id}`);

  if (!data.message) {
    toast.error(data.message);
    return;
  }

  return data.room;
});

// export const deleteRoom = async(id: string) => {
//   const response = await fetch(`${config.backendUrl}/api/v1/rooms/${id}`, {
//     method: "DELETE",
//     credentials: "include",
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     toast.error(error.message);
//     return;
//   }

//   const data = await response.json();
//   toast.success(data.message);
//   return data.message;
// }