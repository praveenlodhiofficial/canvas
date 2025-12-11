import type { AuthPayload } from "@repo/shared/types";
import { authMiddleware } from "./middleware/auth.middleware";

const server = Bun.serve<AuthPayload>({
  port: 3002,

  fetch(req, server) {
    if (req.headers.get("upgrade")?.toLowerCase() === "websocket") {
      const authResult = authMiddleware(req);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { payload } = authResult;

      if (server.upgrade(req, { data: payload })) {
        return;
      }

      return new Response("Upgrade failed", { status: 400 });
    }

    return new Response("WS Backend Running!", { status: 200 });
  },

  websocket: {
    open(ws) {
      const user = ws.data as AuthPayload | undefined;

      if (!user) {
        ws.close(1008, "Unauthorized");
        return;
      }

      console.log("Client connected", { user });
      ws.send(
        JSON.stringify({ type: "welcome", message: "Connected to WS server" }),
      );
    },

    message(ws, message) {
      console.log("Client says:", message);

      // Echo message back
      ws.send(JSON.stringify({ type: "echo", message }));
    },

    close(ws) {
      console.log("Client disconnected");
    },
  },
});

console.log(`WebSocket server running on ${server.url}`);
