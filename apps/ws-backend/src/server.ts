import type { Server } from "bun";
import type { WebSocketData } from "@repo/shared/types";

let bunServer: Server<WebSocketData>;

export function registerServer(server: Server<WebSocketData>) {
  bunServer = server;
}

export function broadcastToRoom(roomId: string, message: unknown) {
  bunServer.publish(`room:${roomId}`, JSON.stringify(message));
}
