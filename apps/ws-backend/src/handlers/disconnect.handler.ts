import { memoryStore } from "@/store/memory.store";
import { snapshotRoom } from "@/snapshot/snapshot.service";

export function handleDisconnect(roomId: string, userId: string) {
  const room = memoryStore.get(roomId);
  if (!room) return;

  room.users.delete(userId);

  // ALWAYS snapshot on disconnect
  snapshotRoom(room);

  // Cleanup when last user leaves
  if (room.users.size === 0) {
    memoryStore.delete(roomId);
  }
}
