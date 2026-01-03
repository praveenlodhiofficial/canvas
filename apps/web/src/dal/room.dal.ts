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
  }));
});
