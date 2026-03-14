import { RoomState } from "@/rooms/room.state";
import { memoryStore } from "@/store/memory.store";

export function handleConnection(roomId: string, userId: string) {
  const room: RoomState = memoryStore.get(roomId) ?? memoryStore.create(roomId);

  room.users.add(userId);

  return {
    shapes: Array.from(room.shapes.values()),
  };
}
