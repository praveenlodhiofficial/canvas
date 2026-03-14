import { useEffect, useRef, useState } from "react";

import { CanvasShape } from "@repo/shared/types";

import { config } from "@/lib/config";

type RoomWebSocketOptions = {
  onRoomInit?: (shapes: CanvasShape[]) => void;
};

export function useRoomWebSocket(
  roomId: string,
  setShapes: React.Dispatch<React.SetStateAction<Map<string, CanvasShape>>>,
  options?: RoomWebSocketOptions
) {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<"connecting" | "connected" | "error">(
    "connecting"
  );
  const onRoomInitRef = useRef(options?.onRoomInit);
  onRoomInitRef.current = options?.onRoomInit;

  useEffect(() => {
    const ws = new WebSocket(`${config.websocketUrl}?room=${roomId}`);
    wsRef.current = ws;

    ws.onopen = () => setStatus("connected");
    ws.onerror = () => setStatus("error");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "room:init") {
        const payload = msg.payload as CanvasShape[];
        const map = new Map(payload.map((s: CanvasShape) => [s.id, s]));
        if (onRoomInitRef.current) {
          onRoomInitRef.current(payload);
        } else {
          setShapes(map);
        }
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
  }, [roomId, setShapes]);

  return { wsRef, status };
}
