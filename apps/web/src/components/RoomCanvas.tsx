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
import { useEraser } from "@/hooks/canvas/useEraser";

import { ToolBar } from "@/components/ToolBar";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { getCanvasTheme } from "@/lib/canvas/theme";

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
  roomName,
  totalMembers,
}: {
  initialShapes: CanvasShape[];
  roomId: string;
  roomName: string;
  totalMembers: number;
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
  const { theme } = useTheme();
  const canvasTheme = useMemo(() => getCanvasTheme(theme ?? undefined), [theme]);
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

  /* ======================== ERASER ======================== */
  useEraser(
    tool === "eraser",
    canvasRef,
    Array.from(shapes.values()),
    setShapes,
    wsRef
  );

  /* ======================== RENDER ======================== */
  useCanvasRender(
    canvasRef,
    ctxRef,
    Array.from(shapes.values()),
    preview,
    tool,
    selectedIds,
    canvasTheme
  );

  /* ======================== CANVAS UI ======================== */
  return (
    <div className="relative w-full h-full bg-background">
      {/* Canvas (background filled in render to match theme); eraser shows crosshair cursor */}
      <canvas
        ref={canvasRef}
        className="w-full h-full z-10"
        style={{ cursor: tool === "eraser" ? "crosshair" : undefined }}
      />

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

      <div className="absolute left-1/2 top-4 z-50 flex w-full  -translate-x-1/2 items-center justify-between gap-4 px-4 pointer-events-none">
        <div className="rounded-xl border border-border bg-card/95 px-4 py-2.5 shadow-lg shadow-black/5 backdrop-blur-md dark:bg-card/90 dark:shadow-black/20 pointer-events-auto">
          <h1 className="text-lg font-semibold capitalize text-foreground">{roomName}</h1>
        </div>
        <div className="pointer-events-auto">
          <ToolBar tool={tool} setTool={setTool} />
        </div>
        <div className="rounded-xl border border-border bg-card/95 px-4 py-2.5 shadow-lg shadow-black/5 backdrop-blur-md dark:bg-card/90 dark:shadow-black/20 pointer-events-auto">
          <span className="text-sm text-muted-foreground">{totalMembers} member{totalMembers !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </div>
  );
}
