import type { ServerWebSocket } from "bun";

import { leaveRoom } from "../rooms/room.manager";
import { broadcastToRoom } from "../server";
import { snapshotRoom } from "../snapshot/snapshot.service";
import type { WsData } from "./connection.handler";

/**
 * Handle socket close:
 * - updates room presence via `leaveRoom`
 * - snapshots the room state
 * - notifies remaining clients that a user left
 */
export async function handleDisconnect(ws: ServerWebSocket<WsData>) {
  const roomId = ws.data.room;
  const userId = ws.data.user.id;

  const leaveResult = await leaveRoom(roomId, userId);
  if (!leaveResult) {
    console.warn("[WS] leaveRoom returned null, skipping snapshot", {
      roomId,
      userId,
    });
    return;
  }

  const { room, userName } = leaveResult;

  await snapshotRoom(room);

  broadcastToRoom(roomId, {
    type: "room:user_left",
    payload: {
      userId,
      userName,
      presentCount: room.users.size,
    },
  });
}
