import type { ServerWebSocket } from "bun";

import { prisma } from "@repo/database";
import type { WebSocketData } from "@repo/shared/types";

import { config } from "./lib/config";
import { authMiddleware } from "./middleware/auth.middleware";
import { applyShape, joinRoom, leaveRoom } from "./rooms/room.manager";
import type { ClientMessage } from "./rooms/room.types";
import { broadcastToRoom, registerServer } from "./server";
import { snapshotRoom } from "./snapshot/snapshot.service";
import { memoryStore } from "./store/memory.store";

type WsData = WebSocketData & {
  room: string;
};

const server = Bun.serve<WsData>({
  port: config.port,

  async fetch(req, server) {
    // Railway health check: respond to plain HTTP (non-WebSocket) requests
    if (req.headers.get("upgrade")?.toLowerCase() !== "websocket") {
      return new Response("WebSocket server running", { status: 200 });
    }

    const auth = await authMiddleware(req);
    if (!auth.ok) {
      if (config.nodeEnv === "development")
        console.warn("[WS] Connection rejected: auth failed");
      return auth.response;
    }

    const url = new URL(req.url);
    const roomId = url.searchParams.get("room");

    if (!roomId) {
      if (config.nodeEnv === "development")
        console.warn("[WS] Connection rejected: room query missing");
      return new Response("Room is required", { status: 400 });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true },
    });

    if (!room) {
      if (config.nodeEnv === "development")
        console.warn("[WS] Connection rejected: room not found", roomId);
      return new Response("Room not found", { status: 404 });
    }

    const success = server.upgrade(req, {
      data: {
        user: auth.payload,
        room: roomId,
      },
    });

    if (success) return;
    if (config.nodeEnv === "development")
      console.warn("[WS] Connection rejected: upgrade failed");
    return new Response("Upgrade failed", { status: 500 });
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
      const joinResult = await joinRoom(roomId, userId);
      if (joinResult === null && config.nodeEnv === "development") {
        console.warn(
          "[WS] joinRoom returned null for room:",
          roomId,
          "user:",
          userId
        );
      }

      if (joinResult) {
        ws.send(
          JSON.stringify({
            type: "room:init",
            payload: joinResult.shapes,
            presentCount: joinResult.presentCount,
          })
        );
        broadcastToRoom(roomId, {
          type: "room:user_joined",
          payload: {
            userId,
            userName: joinResult.userName,
            presentCount: joinResult.presentCount,
          },
        });
      }
    },

    message: async (ws, rawMessage) => {
      let msg: ClientMessage;

      try {
        msg = JSON.parse(rawMessage.toString());
      } catch {
        if (config.nodeEnv === "development")
          console.warn("[WS] Invalid message");
        return;
      }

      const roomId = ws.data.room;

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
      }

      /* ---------- DELETE SHAPES ---------- */
      if (msg.type === "shape:delete") {
        const ids = msg.payload;

        const room = memoryStore.get(roomId);
        if (!room) return;

        // remove from memory
        ids.forEach((id) => room.shapes.delete(id));
        room.lastUpdated = Date.now();

        // remove from DB
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
    },

    /* ---------------- CLOSE WS CONNECTION ---------------- */
    close: async (ws: ServerWebSocket<WsData>) => {
      const roomId = ws.data.room;
      const userId = ws.data.user.id;

      const leaveResult = await leaveRoom(roomId, userId);
      if (!leaveResult) {
        if (config.nodeEnv === "development")
          console.warn("[WS] leaveRoom returned null, skipping snapshot", {
            roomId,
            userId,
          });
        return;
      }

      const { room, userName } = leaveResult;

      // Take a snapshot of the room before disconnecting
      await snapshotRoom(room);

      broadcastToRoom(roomId, {
        type: "room:user_left",
        payload: {
          userId,
          userName,
          presentCount: room.users.size,
        },
      });
    },
  },
});

/* ---------------- REGISTER BUN SERVER FOR BROADCAST HELPER ---------------- */
registerServer(server);

if (config.nodeEnv === "development") {
  console.log(`[WS] WebSocket server running on ${server.url}`);
}
