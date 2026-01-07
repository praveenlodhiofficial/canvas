import type { ServerWebSocket } from "bun";
import type { WebSocketData } from "@repo/shared/types";
import { authMiddleware } from "./middleware/auth.middleware";
import { prisma } from "@repo/database";

type WsData = WebSocketData & {
  room: string;
};

const server = Bun.serve<WsData>({
  port: 3002,

  fetch: async (req, server) => {
    // Only handle WS upgrades
    if (req.headers.get("upgrade")?.toLowerCase() !== "websocket") {
      return new Response("WS Backend Running", { status: 200 });
    }

    // 1️⃣ Authenticate
    const auth = await authMiddleware(req);
    if (!auth.ok) return auth.response;

    // 2️⃣ Extract roomId
    const url = new URL(req.url);
    const roomId = url.searchParams.get("room");

    if (!roomId) {
      return Response.json({ message: "Room is required" }, { status: 400 });
    }

    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
      select: {
        name: true,
      },
    });

    if (!existingRoom) {
      // return Response.json({ message: "Room not found" }, { status: 404 });
      return new Response("Room not found", { status: 404 });
    }

    // if (existingRoom.adminId !== auth.payload.id) {
    //   return Response.json({ message: "You are not the admin of this room" }, { status: 403 });
    // }

    // 3️⃣ Upgrade connection
    const success = server.upgrade(req, {
      data: {
        user: auth.payload,
        room: existingRoom.name,
      },
    });

    if (success) return;
    return Response.json({ message: "WebSocket upgrade failed" }, { status: 400 });
  },

  websocket: {
    data: {} as WsData,

    // 🔗 Client connected
    open(ws: ServerWebSocket<WsData>) {
      const channel = `room:${ws.data.room}`;

      ws.subscribe(channel);

      ws.send(
        JSON.stringify({
          type: "room:joined",
          room: ws.data.room,
          user: {
            id: ws.data.user.id,
            email: ws.data.user.email,
          },
        }),
      );

      console.log(
        `[WS] ${ws.data.user.id} joined ${channel}`,
      );
    },

    // 📩 Incoming canvas events
    message(ws, rawMessage) {
      const channel = `room:${ws.data.room}`;

      // IMPORTANT:
      // rawMessage should be a canvas delta (not full state)
      server.publish(channel, rawMessage.toString());
    },

    // ❌ Client disconnected
    close(ws) {
      const channel = `room:${ws.data.room}`;
      ws.unsubscribe(channel);

      console.log(
        `[WS] ${ws.data.user.id} left ${channel}`,
      );
    },
  },
});

console.log(`✅ WebSocket server running on ${server.url}`);
