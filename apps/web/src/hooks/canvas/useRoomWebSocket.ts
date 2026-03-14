import { useEffect, useRef, useState } from "react";
import { CanvasShape } from "@repo/shared/types";
import { config } from "@/lib/config";

export function useRoomWebSocket(
  roomId: string,
  setShapes: React.Dispatch<React.SetStateAction<Map<string, CanvasShape>>>
) {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<
    "connecting" | "connected" | "error"
  >("connecting");

  useEffect(() => {
    const ws = new WebSocket(`${config.websocketUrl}?room=${roomId}`);
    wsRef.current = ws;

    ws.onopen = () => setStatus("connected");
    ws.onerror = () => setStatus("error");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      
      if (msg.type === "room:init") {
        setShapes(new Map(msg.payload.map((s: CanvasShape) => [s.id, s])));
      }

      if (msg.type === "shape:created") {
        setShapes((prev) => new Map(prev).set(msg.payload.id, msg.payload));
      }

      if (msg.type === "shape:updated") {
        setShapes((prev) => new Map(prev).set(msg.payload.id, msg.payload));
      }

      if (msg.type === "shape:deleted") {
        setShapes((prev) => {
          const next = new Map(prev);
          msg.payload.forEach((id: string) => next.delete(id));
          return next;
        });
      }
    };

    return () => ws.close();
  }, [roomId]);

  return { wsRef, status };
}
