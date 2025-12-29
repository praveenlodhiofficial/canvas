import { App } from "@/core/app";
import { Router } from "@/core/router";
import { registerAuthRoutes } from "@/routes/auth.route";
import { registerRoomRoutes } from "@/routes/room.route";
import { corsMiddleware } from "@/middleware/cors.middleware";

const router = new Router();
registerAuthRoutes(router);
registerRoomRoutes(router);

const app = new App(router);
app.use(corsMiddleware);

const server = Bun.serve({
  port: 3001,
  fetch: (req) => app.fetch(req),
});

console.log(`HTTP server running on ${server.url}`);
