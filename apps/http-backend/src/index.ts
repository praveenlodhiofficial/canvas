const server = Bun.serve({
  port: 3001,
  fetch(request) {
    return new Response("Welcome to Bun http server")
  }
})

console.log(`HTTP server running on ${server.url}`);