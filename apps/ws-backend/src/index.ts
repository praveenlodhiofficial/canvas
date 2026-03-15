import { prisma } from "@repo/database";

import { handleConnection, type WsData } from "./handlers/connection.handler";
import { handleDisconnect } from "./handlers/disconnect.handler";
import { handleMessage } from "./handlers/message.handler";
import { config } from "./lib/config";
import { authMiddleware } from "./middleware/auth.middleware";
import { registerServer } from "./server";

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
    open: handleConnection,

    /* ---------------- INCOMING MESSAGES ---------------- */
    message: (ws, rawMessage) => handleMessage(ws, rawMessage),

    /* ---------------- CLOSE WS CONNECTION ---------------- */
    close: handleDisconnect,
  },
});

/* ---------------- REGISTER BUN SERVER FOR BROADCAST HELPER ---------------- */
registerServer(server);

if (config.nodeEnv === "development") {
  console.log(`[WS] WebSocket server running on ${server.url}`);
}
