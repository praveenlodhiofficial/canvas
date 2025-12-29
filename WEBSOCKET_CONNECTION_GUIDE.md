# WebSocket Connection Guide

## Overview

After creating a room, you need to:

1. Get a JWT token (via sign in)
2. Connect to the WebSocket server with authentication
3. Subscribe to the room using the room slug

## Step 1: Get JWT Token

First, sign in to get your JWT token:

```bash
POST http://localhost:3001/api/v1/signin
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Response:**

```json
{
  "message": "User signed in successfully",
  "email": "your-email@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Save the `token` value - you'll need it for WebSocket authentication.

## Step 2: Connect to WebSocket Server

The WebSocket server runs on `ws://localhost:3002`

### Authentication Methods

**Note:** Browser WebSocket API doesn't support custom headers. Use the query parameter method.

#### Method 1: Query Parameter (Browser - Recommended)

```javascript
const token = "your-jwt-token-here";
const ws = new WebSocket(`ws://localhost:3002?token=${token}`);
```

#### Method 2: Authorization Header (Node.js/Server-side only)

```javascript
const token = "your-jwt-token-here";
const ws = new WebSocket("ws://localhost:3002", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## Step 3: Subscribe to Room

Once connected, subscribe to your room using the room slug from the creation response.

For your room "piyu room 01" with slug `"piyu-room-01"`:

```javascript
// After connection is open
ws.send(
  JSON.stringify({
    type: "subscribe",
    roomSlug: "piyu-room-01",
  }),
);
```

## Complete Browser Example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>WebSocket Room Connection</title>
  </head>
  <body>
    <div id="messages"></div>
    <script>
      // Step 1: Replace with your actual token from signin
      const token = "YOUR_JWT_TOKEN_HERE";
      const roomSlug = "piyu-room-01"; // From room creation response

      // Step 2: Connect to WebSocket (using query parameter for browser)
      const ws = new WebSocket(`ws://localhost:3002?token=${token}`);

      // Step 3: Handle connection open
      ws.onopen = () => {
        console.log("Connected to WebSocket server");

        // Subscribe to room
        ws.send(
          JSON.stringify({
            type: "subscribe",
            roomSlug: roomSlug,
          }),
        );
      };

      // Step 4: Handle messages
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Received:", message);

        const messagesDiv = document.getElementById("messages");
        messagesDiv.innerHTML += `<p>${JSON.stringify(message, null, 2)}</p>`;

        // Handle different message types
        switch (message.type) {
          case "welcome":
            console.log("Welcome message:", message.message);
            break;

          case "subscribed":
            console.log(`Successfully subscribed to room: ${message.roomSlug}`);
            break;

          case "room-created":
            console.log("Room created event:", message.room);
            break;

          case "room-message":
            console.log(`Message in ${message.roomSlug}:`, message.content);
            break;
        }
      };

      // Step 5: Handle errors
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      // Step 6: Handle disconnection
      ws.onclose = (event) => {
        console.log(
          "Disconnected from WebSocket server",
          event.code,
          event.reason,
        );
      };

      // Function to send a message to the room
      function sendRoomMessage(content) {
        ws.send(
          JSON.stringify({
            type: "message",
            roomSlug: roomSlug,
            content: content,
          }),
        );
      }

      // Example: Send a message after 2 seconds
      setTimeout(() => {
        sendRoomMessage("Hello from the room!");
      }, 2000);
    </script>
  </body>
</html>
```

## Node.js Example (using `ws` package)

```javascript
import WebSocket from "ws";

const token = "YOUR_JWT_TOKEN_HERE";
const roomSlug = "piyu-room-01";

// Connect with Authorization header (Node.js supports custom headers)
const ws = new WebSocket("ws://localhost:3002", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Alternative: Use query parameter (works everywhere)
// const ws = new WebSocket(`ws://localhost:3002?token=${token}`);

ws.on("open", () => {
  console.log("Connected to WebSocket server");

  // Subscribe to room
  ws.send(
    JSON.stringify({
      type: "subscribe",
      roomSlug: roomSlug,
    }),
  );
});

ws.on("message", (data) => {
  const message = JSON.parse(data.toString());
  console.log("Received:", message);

  switch (message.type) {
    case "welcome":
      console.log("Welcome:", message.message);
      break;

    case "subscribed":
      console.log(`Subscribed to: ${message.roomSlug}`);
      break;

    case "room-created":
      console.log("Room created:", message.room);
      break;

    case "room-message":
      console.log(`Message from ${message.userId}: ${message.content}`);
      break;
  }
});

ws.on("error", (error) => {
  console.error("WebSocket error:", error);
});

ws.on("close", (code, reason) => {
  console.log("Disconnected:", code, reason.toString());
});

// Send a message to the room
function sendMessage(content) {
  ws.send(
    JSON.stringify({
      type: "message",
      roomSlug: roomSlug,
      content: content,
    }),
  );
}
```

## Message Types

### Client Messages (You → Server)

**Subscribe to room:**

```json
{
  "type": "subscribe",
  "roomSlug": "piyu-room-01"
}
```

**Unsubscribe from room:**

```json
{
  "type": "unsubscribe",
  "roomSlug": "piyu-room-01"
}
```

**Send message to room:**

```json
{
  "type": "message",
  "roomSlug": "piyu-room-01",
  "content": "Hello everyone!"
}
```

### Server Messages (Server → You)

**Welcome:**

```json
{
  "type": "welcome",
  "message": "Connected to WS server"
}
```

**Subscribed confirmation:**

```json
{
  "type": "subscribed",
  "roomSlug": "piyu-room-01"
}
```

**Room created event:**

```json
{
  "type": "room-created",
  "room": {
    "id": "room-id",
    "name": "piyu room 01",
    "slug": "piyu-room-01",
    "createdBy": "Piyush Kumar"
  }
}
```

**Room message:**

```json
{
  "type": "room-message",
  "roomSlug": "piyu-room-01",
  "content": "Hello everyone!",
  "userId": "user-id"
}
```

**Error:**

```json
{
  "type": "error",
  "message": "Error description"
}
```

## Testing with Your Room

For the room you just created:

- **Room Name:** "piyu room 01"
- **Room Slug:** "piyu-room-01"
- **Created By:** "Piyush Kumar"

Use `"piyu-room-01"` as the `roomSlug` when subscribing!

## Troubleshooting

1. **401 Unauthorized**: Make sure your JWT token is valid and not expired
2. **Connection refused**: Ensure the WS backend is running on port 3002
3. **Not receiving room-created event**: The event is only sent to subscribers. If you subscribe after room creation, you won't receive the initial event (but you'll receive future events)
4. **Messages not broadcasting**: Make sure all clients are subscribed to the same room topic
