import type { WebSocketData } from "@repo/shared/types";
import { authMiddleware } from "./middleware/auth.middleware";
import type { ServerWebSocket } from "bun";


// "praveen-room" → [ socket1, socket2, socket3 ]
const rooms = new Map<string, Set<ServerWebSocket<WebSocketData>>>();


const server = Bun.serve<WebSocketData>({
  port: 3002,

  fetch(req, server) {
    if (req.headers.get("upgrade")?.toLowerCase() === "websocket") {
      const authResult = authMiddleware(req);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { payload } = authResult;

      const url = new URL(req.url);
      const room = url.searchParams.get("room");

      if (!room) {
        return new Response("Room is required", { status: 400 });
      }

      if (
        server.upgrade(req, {
          data: {
            user: payload,
            room: room,
          },
        })
      ) {
        return;
      }

      return new Response("Upgrade failed", { status: 400 });
    }

    return new Response("WS Backend Running!", { status: 200 });
  },

  websocket: {
    // 🔗 Client connected
    open(ws) {
      const { user, room } = ws.data;

      if (!rooms.has(room)) {
        rooms.set(room, new Set());
      }

      rooms.get(room)!.add(ws);

      console.log(`${user.id} joined room ${room}`);

      ws.send(
        JSON.stringify({
          type: "joined-room",
          room,
          user: {
            id: user.id,
            email: user.email,
          },
        })
      );
    },

    // 📩 Client sent message
    message(ws, rawMessage) {
      const { user, room } = ws.data;
      const message = rawMessage.toString();

      console.log(`${user.id} says "${message}" in ${room}`);

      const clients = rooms.get(room);
      if (!clients) return;

      // Broadcast to everyone except sender
      for (const client of clients) {
        if (client !== ws) {
          client.send(
            JSON.stringify({
              type: "room-message",
              message,
              user: {
                id: user.id,
                email: user.email,
              },
            })
          );
        }
      }
    },

    // ❌ Client disconnected
    close(ws) {
      const { user, room } = ws.data;

      const clients = rooms.get(room);
      if (clients) {
        clients.delete(ws);

        if (clients.size === 0) {
          rooms.delete(room);
        }
      }

      console.log(`${user.id} left room ${room}`);
    },
  },
});

console.log(`WebSocket server running on ${server.url}`);