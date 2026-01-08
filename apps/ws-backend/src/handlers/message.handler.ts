import { memoryStore } from "@/store/memory.store";
import { broadcastToRoom } from "@/server";
import { CanvasShape } from "@repo/shared/types";

export function handleShapeUpdate(roomId: string, shape: CanvasShape) {
  const room = memoryStore.get(roomId);
  if (!room) return;

  room.shapes.set(shape.id, shape);
  room.lastUpdated = Date.now();

  broadcastToRoom(roomId, {
    type: "SHAPE_UPDATE",
    payload: shape,
  });
}
