import { useEffect, useRef, useState } from "react";

import { CanvasShape } from "@repo/shared/types";

import { config } from "@/lib/config";

type RoomWebSocketOptions = {
  onRoomInit?: (shapes: CanvasShape[]) => void;
  onUserJoined?: (userName: string) => void;
  /** If set, join toast is not shown for this user (avoids self-toast). */
  currentUserId?: string | null;
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
  const [presentCount, setPresentCount] = useState<number | null>(null);
  const onRoomInitRef = useRef(options?.onRoomInit);
  const onUserJoinedRef = useRef(options?.onUserJoined);
  const currentUserId = options?.currentUserId ?? null;
  onRoomInitRef.current = options?.onRoomInit;
  onUserJoinedRef.current = options?.onUserJoined;

  useEffect(() => {
    const ws = new WebSocket(`${config.wsUrl}?room=${roomId}`);
    wsRef.current = ws;

    ws.onopen = () => setStatus("connected");
    ws.onerror = () => setStatus("error");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "room:init") {
        const payload = (msg.payload ?? []) as CanvasShape[];
        const map = new Map(payload.map((s: CanvasShape) => [s.id, s]));
        if (onRoomInitRef.current) {
          onRoomInitRef.current(payload);
        } else {
          setShapes(map);
        }
        if (typeof msg.presentCount === "number") {
          setPresentCount(msg.presentCount);
        }
      }

      if (msg.type === "room:user_joined") {
        const { presentCount: count, userName, userId } = msg.payload ?? {};
        if (typeof count === "number") setPresentCount(count);
        const isSelf = currentUserId != null && userId === currentUserId;
        if (userName && onUserJoinedRef.current && !isSelf) {
          onUserJoinedRef.current(userName);
        }
      }

      if (msg.type === "room:user_left") {
        const { presentCount: count } = msg.payload ?? {};
        if (typeof count === "number") setPresentCount(count);
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

  return { wsRef, status, presentCount };
}
