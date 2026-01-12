// import { memoryStore } from "@/store/memory.store";
// import { broadcastToRoom } from "@/server";
// import { CanvasShape } from "@repo/shared/types";

// export function handleShapeUpdate(roomId: string, shape: CanvasShape, selectedIds: string[]) {
//   const room = memoryStore.get(roomId);
//   if (!room) return;

//   room.shapes.set(shape.id, shape);
//   selectedIds.forEach((id) => room.shapes.delete(id));
//   room.lastUpdated = Date.now();

//   broadcastToRoom(roomId, {
//     type: "SHAPE_UPDATE",
//     payload: shape,
//   });

//   broadcastToRoom(roomId, {
//     type: "SHAPE_DELETE",
//     payload: { ids: Array.from(selectedIds) },
//   });
// }
