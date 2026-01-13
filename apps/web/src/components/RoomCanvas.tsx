"use client";

import { useRef, useState } from "react";
import { CanvasShape } from "@repo/shared/types";
import { ToolType } from "@/types/tool";

import { useCanvasInit } from "@/hooks/canvas/useCanvasInit";
import { useCanvasRender } from "@/hooks/canvas/useCanvasRender";

import { useRoomWebSocket } from "@/hooks/canvas/useRoomWebSocket";
import { useKeyboardDelete } from "@/hooks/canvas/useKeyboardDelete";
import { useCanvasTools } from "@/hooks/canvas/useCanvasTools";
import { useSelection } from "@/hooks/canvas/useSelection";

import { ToolBar } from "@/components/ToolBar";

/**
 * ======================== ROOM CANVAS ORCHESTRATES ========================
 * 
 * - Canvas lifecycle
 * - Shape state
 * - WebSocket sync
 * - Tool switching
 *
 * ======================== ALL LOGIC LIVES IN HOOKS. ========================
 */
export default function RoomCanvas({
  initialShapes,
  roomId,
}: {
  initialShapes: CanvasShape[];
  roomId: string;
}) {
  /* ======================== CANVAS REFERENCES ======================== */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useCanvasInit(canvasRef);

  /* ======================== STATE ======================== */
  const [shapes, setShapes] = useState<Map<string, CanvasShape>>(
    () => new Map(initialShapes.map((s) => [s.id, s]))
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<CanvasShape | null>(null);
  const [tool, setTool] = useState<ToolType>("box");

  /* ======================== WEBSOCKET ======================== */
  const { wsRef, status } = useRoomWebSocket(roomId, setShapes);

  /* ======================== KEYBOARD DELETE ======================== */
  useKeyboardDelete(selectedIds, setShapes, wsRef, () =>
    setSelectedIds(new Set())
  );

  /* ======================== DRAW TOOLS ======================== */
  useCanvasTools(
    tool,
    canvasRef,
    (shape: CanvasShape) => {
      // optimistic UI
      setShapes((prev) => new Map(prev).set(shape.id, shape));

      // notify server
      wsRef.current?.send(
        JSON.stringify({ type: "shape:add", payload: shape })
      );
    },
    setPreview
  );

  /* ======================== SELECTION ======================== */
  useSelection(
    tool === "selection",
    canvasRef,
    Array.from(shapes.values()),
    setSelectedIds,
    setPreview
  );

  /* ======================== RENDER ======================== */
  useCanvasRender(
    canvasRef,
    ctxRef,
    Array.from(shapes.values()),
    preview,
    tool,
    selectedIds
  );

  /* ======================== CANVAS UI ======================== */
  return (
    <div className="relative w-full h-full">
      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full h-full z-10" />

      {/* Connection overlay */}
      {status !== "connected" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-20">
          <p className="text-sm font-medium">
            {status === "connecting"
              ? "Connecting to room…"
              : "Connection failed"}
          </p>
        </div>
      )}

      {/* Toolbar */}
      <ToolBar tool={tool} setTool={setTool} />
    </div>
  );
}
