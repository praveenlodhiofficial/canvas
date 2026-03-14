import { App } from "@/core/app";
import { Router } from "@/core/router";
import { config } from "@/lib/config";
import { corsMiddleware } from "@/middleware/cors.middleware";
import { registerAuthRoutes } from "@/routes/auth.route";
import { registerRoomRoutes } from "@/routes/room.route";

import { registerRoomMemberRoutes } from "./routes/roomMember.route";
import { registerShapeRoutes } from "./routes/shape.route";

const router = new Router();
registerAuthRoutes(router);
registerRoomRoutes(router);
registerRoomMemberRoutes(router);
registerShapeRoutes(router);

const app = new App(router);
app.use(corsMiddleware);

const server = Bun.serve({
  port: config.port,
  fetch: (req) => app.fetch(req),
});

if (config.nodeEnv === "development") {
  console.log(`HTTP server running on ${server.url}`);
}
