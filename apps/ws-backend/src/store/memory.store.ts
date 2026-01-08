import { RoomState } from "@/rooms/room.state";

class MemoryStore {
  private rooms = new Map<string, RoomState>();

  get(roomId: string) {
    return this.rooms.get(roomId);
  }

  create(roomId: string) {
    const room: RoomState = {
      roomId,
      shapes: new Map(),
      users: new Set(),
      lastUpdated: Date.now(),
    };

    this.rooms.set(roomId, room);
    return room;
  }

  delete(roomId: string) {
    this.rooms.delete(roomId);
  }

  values() {
    return this.rooms.values();
  }
}

export const memoryStore = new MemoryStore();
