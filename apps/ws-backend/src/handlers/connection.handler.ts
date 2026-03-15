import type { ServerWebSocket } from "bun";

import type { WebSocketData } from "@repo/shared/types";

import { config } from "../lib/config";
import { joinRoom } from "../rooms/room.manager";
import { broadcastToRoom } from "../server";

/**
 * Narrow WebSocket data used inside handlers.
 * It mirrors the data set in `index.ts` during `server.upgrade`.
 */
export type WsData = WebSocketData & {
  room: string;
};

/**
 * Handle a new WebSocket connection:
 * - subscribes the socket to the room channel
 * - joins the in‑memory room state (and DB where needed)
 * - sends initial room snapshot to the connecting client
 * - notifies other clients that a user joined
 */
export async function handleConnection(ws: ServerWebSocket<WsData>) {
  const roomId = ws.data.room;
  const userId = ws.data.user.id;
  const channel = `room:${roomId}`;

  ws.subscribe(channel);

  const joinResult = await joinRoom(roomId, userId);
  if (joinResult === null && config.nodeEnv === "development") {
    console.warn(
      "[WS] joinRoom returned null for room:",
      roomId,
      "user:",
      userId
    );
  }

  if (!joinResult) return;

  // Send initial shapes snapshot + present count to the new client
  ws.send(
    JSON.stringify({
      type: "room:init",
      payload: joinResult.shapes,
      presentCount: joinResult.presentCount,
    })
  );

  // Broadcast presence update to everyone in the room
  broadcastToRoom(roomId, {
    type: "room:user_joined",
    payload: {
      userId,
      userName: joinResult.userName,
      presentCount: joinResult.presentCount,
    },
  });
}
