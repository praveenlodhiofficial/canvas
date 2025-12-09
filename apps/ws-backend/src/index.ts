const server = Bun.serve({
  port: 3002,

  fetch(req, server) {
    // If request is asking for WebSocket → upgrade connection
    if (server.upgrade(req)) return;

    return new Response("WS Backend Running!", { status: 200 });
  },

  websocket: {
    open(ws) {
      console.log("Client connected");
      ws.send(JSON.stringify({ type: "welcome", message: "Connected to WS server" }));
    },

    message(ws, message) {
      console.log("Client says:", message);

      // Echo message back
      ws.send(JSON.stringify({ type: "echo", message }));
    },

    close(ws) {
      console.log("Client disconnected");
    }
  }
});

console.log(`WebSocket server running on ${server.url}`);
