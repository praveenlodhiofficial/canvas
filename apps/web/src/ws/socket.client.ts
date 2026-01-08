import { config } from "@/lib/config";

export function createRoomSocket(roomId: string) {
  const ws = new WebSocket(`${config.websocketUrl}?room=${roomId}`);

  return ws;
}
