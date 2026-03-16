import type { ServerWebSocket } from "bun";

import { prisma } from "@repo/database";

import { applyShape } from "../rooms/room.manager";
import type { ClientMessage } from "../rooms/room.types";
import { broadcastToRoom } from "../server";
import { memoryStore } from "../store/memory.store";
import type { WsData } from "./connection.handler";

/**
 * Handle all messages coming from the client:
 * - cursor_move: ephemeral live‑cursor event
 * - selection_change: ephemeral selection highlight
 * - shape:add / shape:update / shape:delete: persistent shape mutations
 */
export async function handleMessage(
  ws: ServerWebSocket<WsData>,
  rawMessage: string | Buffer
) {
  let msg: ClientMessage;

  try {
    msg = JSON.parse(rawMessage.toString());
  } catch {
    console.warn("[WS] Invalid message");
    return;
  }

  const roomId = ws.data.room;
  const user = ws.data.user;

  /* ---------- CURSOR MOVE (presence / live cursors) ---------- */
  if (msg.type === "cursor_move") {
    broadcastToRoom(roomId, {
      type: "cursor_move",
      payload: {
        userId: user.id,
        userName: user.name ?? user.email ?? "Anonymous",
        x: msg.x,
        y: msg.y,
      },
    });
    return;
  }

  /* ---------- SELECTION CHANGE (highlight who selected what) ---------- */
  if (msg.type === "selection_change") {
    broadcastToRoom(roomId, {
      type: "selection_change",
      payload: {
        userId: user.id,
        userName: user.name ?? user.email ?? "Anonymous",
        selectedShapeIds: msg.selectedShapeIds ?? [],
      },
    });
    return;
  }

  /* ---------- ADD SHAPE ---------- */
  if (msg.type === "shape:add") {
    const shape = {
      ...msg.payload,
      id: msg.payload.id ?? crypto.randomUUID(),
    };

    applyShape(roomId, shape);

    broadcastToRoom(roomId, {
      type: "shape:created",
      payload: shape,
    });
    return;
  }

  /* ---------- UPDATE SHAPE (e.g. move) ---------- */
  if (msg.type === "shape:update") {
    const shape = msg.payload;
    const room = memoryStore.get(roomId);
    if (room && room.shapes.has(shape.id)) {
      room.shapes.set(shape.id, shape);
      room.lastUpdated = Date.now();
      broadcastToRoom(roomId, {
        type: "shape:updated",
        payload: shape,
      });
    }
    return;
  }

  /* ---------- DELETE SHAPES ---------- */
  if (msg.type === "shape:delete") {
    const ids = msg.payload;

    const room = memoryStore.get(roomId);
    if (!room) return;

    ids.forEach((id) => room.shapes.delete(id));
    room.lastUpdated = Date.now();

    await prisma.shape.deleteMany({
      where: {
        id: { in: ids },
        roomId,
      },
    });

    broadcastToRoom(roomId, {
      type: "shape:deleted",
      payload: ids,
    });
  }
}

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
