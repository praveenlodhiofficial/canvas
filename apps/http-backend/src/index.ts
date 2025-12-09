import { handleAuthRoutes } from "./routes/auth.route";

const server = Bun.serve({
  port: 3001,

  fetch(req) {
    const url = new URL(req.url);
    console.log(`Endpoint Hit: ${url.pathname}`);

    // AUTH ROUTES
    if (url.pathname.startsWith("/api/v1")) {
      return handleAuthRoutes(req, url);
    }

    // DEFAULT RESPONSE
    return new Response("Welcome to Bun HTTP server");
  }
});

console.log(`HTTP server running on ${server.url}`);
