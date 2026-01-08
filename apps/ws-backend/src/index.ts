import type { ServerWebSocket } from "bun";
import type { WebSocketData } from "@repo/shared/types";
import { authMiddleware } from "./middleware/auth.middleware";
import { prisma } from "@repo/database";

import { registerServer, broadcastToRoom } from "./server";
import { joinRoom, leaveRoom, applyShape } from "./rooms/room.manager";
import { snapshotRoom } from "./snapshot/snapshot.service";
import type { ClientMessage } from "./rooms/room.types";

type WsData = WebSocketData & {
  room: string;
};

const server = Bun.serve<WsData>({
  port: 3002,

  async fetch(req, server) {
    /* ---------------- ONLY WS UPGRADES ---------------- */
    if (req.headers.get("upgrade")?.toLowerCase() !== "websocket") {
      return new Response("WS Backend Running", { status: 200 });
    }

    const auth = await authMiddleware(req);
    if (!auth.ok) return auth.response;

    const url = new URL(req.url);
    const roomId = url.searchParams.get("room");

    if (!roomId) {
      return new Response("Room is required", { status: 400 });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true },
    });

    if (!room) {
      return new Response("Room not found", { status: 404 });
    }

    const success = server.upgrade(req, {
      data: {
        user: auth.payload,
        room: roomId,
      },
    });

    if (success) return new Response("WebSocket upgrade successful", { status: 200 });

    return new Response("Failed to upgrade to WebSocket", { status: 500 });
  },

  websocket: {
    data: {} as WsData,

    /* ---------------- OPEN WS CONNECTION ---------------- */
    open: async (ws: ServerWebSocket<WsData>) => {
      const roomId = ws.data.room;
      const userId = ws.data.user.id;
      const channel = `room:${roomId}`;

      ws.subscribe(channel);

      // Join room + get initial snapshot
      const shapes = await joinRoom(roomId, userId);

      ws.send(
        JSON.stringify({
          type: "room:init",
          payload: shapes,
        }),
      );
    },

    /* ---------------- MESSAGE (canvas delta) ---------------- */
    message(ws, rawMessage) {
      let msg: ClientMessage;

      try {
        msg = JSON.parse(rawMessage.toString());
      } catch {
        console.warn("[WS] Invalid message received");
        return;
      }

      const roomId = ws.data.room;

      // TODO: Implement shape update later
      if (msg.type === "shape:add") {
        const shape = {
          ...msg.payload,
          id: crypto.randomUUID(),
        };
      
        applyShape(roomId, shape);
        broadcastToRoom(roomId, { type: "shape:broadcast", payload: shape });
      }

      // TODO: Implement shape deletion
      if (msg.type === "shape:delete") {
        // Optional extension:
        // remove from room.shapes + broadcast delete
      }
    },

    /* ---------------- CLOSE WS CONNECTION ---------------- */
    close: async (ws: ServerWebSocket<WsData>) => {
      const roomId = ws.data.room;
      const userId = ws.data.user.id;

      const room = await leaveRoom(roomId, userId);
      if (!room) return;

      // Take a snapshot of the room before disconnecting
      await snapshotRoom(room);

      // TODO: Cleanup handled inside room.manager
    },
  },
});

/* ---------------- REGISTER BUN SERVER FOR BROADCAST HELPER ---------------- */
registerServer(server);

console.log(`[WS] WebSocket server running on ${server.url}`);
