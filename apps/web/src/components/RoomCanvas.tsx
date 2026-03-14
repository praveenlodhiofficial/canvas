"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useTheme } from "next-themes";
import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { CanvasShape } from "@repo/shared/types";

import { TOOL_BY_SHORTCUT, ToolBar } from "@/components/ToolBar";
import { useCanvasInit } from "@/hooks/canvas/useCanvasInit";
import { useCanvasRender } from "@/hooks/canvas/useCanvasRender";
import { useCanvasTools } from "@/hooks/canvas/useCanvasTools";
import {
  type CanvasTransform,
  screenToWorld,
  useCanvasZoom,
} from "@/hooks/canvas/useCanvasZoom";
import { useClipboard } from "@/hooks/canvas/useClipboard";
import { useEraser } from "@/hooks/canvas/useEraser";
import { useKeyboardDelete } from "@/hooks/canvas/useKeyboardDelete";
import { useRoomWebSocket } from "@/hooks/canvas/useRoomWebSocket";
import { useSelection } from "@/hooks/canvas/useSelection";
import { useUndoRedo } from "@/hooks/canvas/useUndoRedo";
import { getCanvasTheme } from "@/lib/canvas/theme";
import { ToolType } from "@/types/tool";

import { Button } from "./ui/button";

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

  /* ======================== STATE (with undo/redo) ======================== */
  const initialMap = useMemo(
    () => new Map(initialShapes.map((s) => [s.id, s])),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: use initial snapshot only on mount
    []
  );
  const { shapes, setShapes, setShapesDirect, undo, redo, resetHistory } =
    useUndoRedo(initialMap);
  const shapesRef = useRef<Map<string, CanvasShape>>(shapes);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pendingEraseIds, setPendingEraseIds] = useState<Set<string>>(
    new Set()
  );
  const [preview, setPreview] = useState<CanvasShape | null>(null);
  const [tool, setTool] = useState<ToolType>("box");
  const [transform, setTransform] = useState<CanvasTransform>({
    scale: 1,
    panX: 0,
    panY: 0,
  });
  const [textInputAt, setTextInputAt] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const textInputResolveRef = useRef<((value: string | null) => void) | null>(
    null
  );
  const textInputRef = useRef<HTMLInputElement>(null);
  const textInputSubmittedRef = useRef(false);
  const lastWorldPointRef = useRef({ x: 0, y: 0 });

  const { theme } = useTheme();
  const canvasTheme = useMemo(
    () => getCanvasTheme(theme ?? undefined),
    [theme]
  );

  const getTextFromUser = useCallback((x: number, y: number) => {
    return new Promise<string | null>((resolve) => {
      textInputResolveRef.current = resolve;
      textInputSubmittedRef.current = false;
      setTextInputAt({ x, y });
    });
  }, []);

  useEffect(() => {
    shapesRef.current = shapes;
  }, [shapes]);

  useEffect(() => {
    if (textInputAt) {
      const t = setTimeout(() => textInputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [textInputAt]);

  const handleTextSubmit = useCallback((value: string | null) => {
    if (textInputSubmittedRef.current) return;
    textInputSubmittedRef.current = true;
    textInputResolveRef.current?.(value);
    textInputResolveRef.current = null;
    setTextInputAt(null);
  }, []);

  const getWorldPoint = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      return screenToWorld(e.clientX, e.clientY, canvas, transform);
    },
    [transform]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onMove = (e: MouseEvent) => {
      lastWorldPointRef.current = getWorldPoint(e);
    };
    canvas.addEventListener("mousemove", onMove);
    return () => canvas.removeEventListener("mousemove", onMove);
  }, [getWorldPoint]);

  const getPastePosition = useCallback(() => lastWorldPointRef.current, []);

  /* ======================== UNDO / REDO + TOOL SHORTCUTS ======================== */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as Node;
      const isInput =
        target &&
        (target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          (target instanceof HTMLElement && target.isContentEditable));
      if (isInput) return;

      const key = e.key.toLowerCase();

      if (key === "escape") {
        e.preventDefault();
        e.stopPropagation();
        setTool("selection");
        setSelectedIds(new Set());
        setPreview(null);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && key === "z") {
        e.preventDefault();
        e.stopPropagation();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && key === "y") {
        e.preventDefault();
        e.stopPropagation();
        redo();
        return;
      }

      if (!e.ctrlKey && !e.metaKey && !e.altKey && key >= "1" && key <= "8") {
        const tool = TOOL_BY_SHORTCUT[key];
        if (tool) {
          e.preventDefault();
          e.stopPropagation();
          setTool(tool);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [undo, redo, setTool, setSelectedIds]);

  /* ======================== ZOOM ======================== */
  useCanvasZoom(canvasRef, setTransform);

  /* ======================== WEBSOCKET ======================== */
  const { wsRef, status } = useRoomWebSocket(roomId, setShapesDirect, {
    onRoomInit: (payload) =>
      resetHistory(new Map(payload.map((s: CanvasShape) => [s.id, s]))),
  });

  /* ======================== KEYBOARD DELETE ======================== */
  useKeyboardDelete(selectedIds, setShapes, wsRef, () =>
    setSelectedIds(new Set())
  );

  /* ======================== CUT / COPY / PASTE ======================== */
  useClipboard(
    selectedIds,
    shapesRef,
    setShapes,
    setSelectedIds,
    wsRef,
    getPastePosition
  );

  /* ======================== DRAW TOOLS ======================== */
  useCanvasTools(
    tool,
    canvasRef,
    (shape: CanvasShape) => {
      setPreview(null);
      setShapes((prev) => new Map(prev).set(shape.id, shape));
      wsRef.current?.send(
        JSON.stringify({ type: "shape:add", payload: shape })
      );
      setSelectedIds(new Set([shape.id]));
      setTool("selection");
    },
    setPreview,
    getTextFromUser,
    getWorldPoint
  );

  /* ======================== SELECTION ======================== */
  const { isOverRotateHandle, isRotating } = useSelection(
    tool === "selection",
    canvasRef,
    Array.from(shapes.values()),
    selectedIds,
    setSelectedIds,
    setPreview,
    setShapes,
    wsRef,
    getWorldPoint
  );

  useEffect(() => {
    if (tool !== "eraser") setPendingEraseIds(new Set());
  }, [tool]);

  useEffect(() => {
    if (tool === "selection" || tool === "eraser") setPreview(null);
  }, [tool]);

  /* ======================== ERASER ======================== */
  useEraser(
    tool === "eraser",
    canvasRef,
    Array.from(shapes.values()),
    setShapes,
    wsRef,
    getWorldPoint,
    setPendingEraseIds
  );

  /* ======================== RENDER ======================== */
  useCanvasRender(
    canvasRef,
    ctxRef,
    Array.from(shapes.values()),
    preview,
    tool,
    selectedIds,
    pendingEraseIds,
    canvasTheme,
    transform
  );

  /* ======================== CANVAS UI ======================== */
  return (
    <div className="bg-background relative h-full w-full">
      {/* Canvas: rotating = grabbing, over rotate handle = grab, selection with shape = move, eraser = crosshair, text = text cursor */}
      <canvas
        ref={canvasRef}
        className="z-10 h-full w-full"
        style={{
          cursor: isRotating
            ? "grabbing"
            : isOverRotateHandle
              ? "grab"
              : tool === "selection" && selectedIds.size > 0
                ? "move"
                : tool === "eraser"
                  ? "crosshair"
                  : tool === "text"
                    ? "text"
                    : undefined,
        }}
      />

      {/* Inline text input on canvas (replaces prompt) */}
      {textInputAt && (
        <div
          className="pointer-events-none absolute top-0 left-0 z-30 h-full w-full"
          style={{ pointerEvents: "none" }}
        >
          <input
            ref={textInputRef}
            type="text"
            className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-ring absolute max-w-[280px] min-w-[120px] rounded border px-2 py-1 text-sm shadow-lg focus:ring-2 focus:outline-none"
            placeholder="Type text..."
            style={{
              left: textInputAt.x,
              top: textInputAt.y,
              pointerEvents: "auto",
              font: "14px sans-serif",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleTextSubmit((e.target as HTMLInputElement).value);
              }
              if (e.key === "Escape") {
                e.preventDefault();
                handleTextSubmit(null);
              }
            }}
            onBlur={() => {
              const value = (textInputRef.current?.value ?? "").trim() || null;
              handleTextSubmit(value);
            }}
          />
        </div>
      )}

      {/* Connection overlay */}
      {status !== "connected" && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm"
          style={{
            backgroundColor:
              status === "connecting"
                ? "rgba(0, 0, 0, 0.05)"
                : "rgba(255, 0, 0, 0.05)",
          }}
        >
          <p className="font-medium">
            {status === "connecting" ? (
              <span className="text-primary">Connecting to room…</span>
            ) : (
              <span className="text-destructive">Connection failed</span>
            )}
          </p>
        </div>
      )}

      <div className="pointer-events-none absolute top-4 left-1/2 z-50 flex w-full -translate-x-1/2 items-center justify-between gap-4 px-4">
        <div className="pointer-events-auto flex items-center gap-2">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="icon-lg"
              className="border-border bg-card/95 dark:bg-card/90 pointer-events-auto rounded-xl border p-6 shadow-lg shadow-black/5 backdrop-blur-md dark:shadow-black/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="border-border bg-card/95 dark:bg-card/90 pointer-events-auto min-w-xs rounded-xl border px-4 py-2.5 shadow-lg shadow-black/5 backdrop-blur-md dark:shadow-black/20">
            <h1 className="text-foreground text-lg font-medium capitalize">
              {roomName}
            </h1>
          </div>
        </div>
        <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2">
          <ToolBar tool={tool} setTool={setTool} />
        </div>
        <div className="border-border bg-card/95 dark:bg-card/90 pointer-events-auto rounded-xl border px-4 py-2.5 shadow-lg shadow-black/5 backdrop-blur-md dark:shadow-black/20">
          <span className="text-muted-foreground text-sm">
            {totalMembers} member{totalMembers !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
