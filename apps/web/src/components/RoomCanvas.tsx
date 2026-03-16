"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useTheme } from "next-themes";
import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { CanvasShape } from "@repo/shared/types";

import { ToolBar } from "@/components/ToolBar";
import { useCanvasInit } from "@/hooks/canvas/useCanvasInit";
import { useCanvasRender } from "@/hooks/canvas/useCanvasRender";
import { useCanvasShortcuts } from "@/hooks/canvas/useCanvasShortcuts";
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
import {
  addOrUpdateUser,
  CURSOR_BROADCAST_MIN_INTERVAL_MS,
  CURSOR_TTL_MS,
  evictStaleCursors,
  getCanvasCursorStyle,
  getParticipantStatusColor,
  IDLE_AFTER_MS,
  markUsersIdle,
  PRESENCE_GC_INTERVAL_MS,
  setRemoteCursor,
  setUserOffline,
} from "@/lib/roomCanvas";
import type { RoomCanvasProps, RoomUser } from "@/types/roomCanvas";
import { ToolType } from "@/types/tool";

import { type RemoteCursor, RemoteCursorOverlay } from "./RemoteCursorOverlay";
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
  currentUserId = null,
  currentUserName = null,
}: RoomCanvasProps) {
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

  const [users, setUsers] = useState<Map<string, RoomUser>>(() => new Map());
  const [remoteCursors, setRemoteCursors] = useState<Map<string, RemoteCursor>>(
    () => new Map()
  );
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

  /* ================ UNDO / REDO + TOOL SHORTCUTS ================ */
  useCanvasShortcuts(setTool, setSelectedIds, setPreview, undo, redo);

  /* ======================== ZOOM ======================== */
  useCanvasZoom(canvasRef, setTransform);

  /* ======================== WEBSOCKET ======================== */
  const { wsRef, status, presentCount } = useRoomWebSocket(
    roomId,
    setShapesDirect,
    {
      onRoomInit: (payload) =>
        resetHistory(new Map(payload.map((s: CanvasShape) => [s.id, s]))),
      onUserJoined: (userId: string, userName: string) => {
        setUsers((prev) =>
          addOrUpdateUser(prev, userId, userName, "active", Date.now())
        );
      },
      onUserLeft: (userId: string, userName: string) => {
        setUsers((prev) => setUserOffline(prev, userId, userName));
      },
      onCursorMove: ({
        userId,
        userName,
        x,
        y,
      }: {
        userId: string;
        userName: string;
        x: number;
        y: number;
      }) => {
        if (userId === currentUserId) return;
        const now = Date.now();
        setUsers((prev) =>
          addOrUpdateUser(prev, userId, userName, "active", now)
        );
        setRemoteCursors((prev) =>
          setRemoteCursor(prev, userId, userName, x, y, now)
        );
      },
      onSelectionChange: ({
        userId,
      }: {
        userId: string;
        userName: string;
        selectedShapeIds: string[];
      }) => {
        if (userId === currentUserId) return;
      },
      currentUserId,
    }
  );

  /* Add current user to participants list when connected so names show (incl. when alone) */
  useEffect(() => {
    if (
      status === "connected" &&
      currentUserId != null &&
      currentUserName != null
    ) {
      setUsers((prev) =>
        addOrUpdateUser(
          prev,
          currentUserId,
          currentUserName,
          "active",
          Date.now()
        )
      );
    }
  }, [status, currentUserId, currentUserName]);

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

  /* ======================== SEND LIVE CURSOR POSITIONS ======================== */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let lastSent = 0;
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastSent < CURSOR_BROADCAST_MIN_INTERVAL_MS) return;
      lastSent = now;

      const world = getWorldPoint(e);
      wsRef.current?.send(
        JSON.stringify({
          type: "cursor_move",
          x: world.x,
          y: world.y,
        })
      );
    };

    canvas.addEventListener("mousemove", onMove);
    return () => canvas.removeEventListener("mousemove", onMove);
  }, [getWorldPoint, wsRef]);

  /* ======================== PRESENCE IDLE / CURSOR GC ======================== */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setUsers((prev) => markUsersIdle(prev, now, IDLE_AFTER_MS));
      setRemoteCursors((prev) => evictStaleCursors(prev, now, CURSOR_TTL_MS));
    }, PRESENCE_GC_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

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
          cursor: getCanvasCursorStyle({
            isRotating,
            isOverRotateHandle,
            tool,
            hasSelection: selectedIds.size > 0,
          }),
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

      {/* Top bar */}
      <div className="pointer-events-none absolute top-4 left-1/2 z-50 flex w-full -translate-x-1/2 items-start justify-between gap-4 px-4">
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
          <div className="border-border bg-card/95 dark:bg-card/90 pointer-events-auto max-w-xs rounded-xl border px-4 py-2.5 pr-20 shadow-lg shadow-black/5 backdrop-blur-md dark:shadow-black/20">
            <h1 className="text-foreground line-clamp-1 text-lg font-medium capitalize">
              {roomName}
            </h1>
          </div>
        </div>

        {/* Tool bar */}
        <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2">
          <ToolBar tool={tool} setTool={setTool} />
        </div>

        {/* Participants overlay */}
        <div className="space-y-2">
          <div className="border-border bg-card/95 dark:bg-card/90 pointer-events-auto w-fit max-w-[250px] min-w-[200px] rounded-xl border px-4 py-2.5 text-sm shadow-lg shadow-black/5 backdrop-blur-md dark:shadow-black/20">
            {/* Participants list */}
            <div className="flex flex-col gap-2 text-sm">
              {Array.from(users.values()).map((u) => (
                <div key={u.userId} className="flex items-center gap-2">
                  <span
                    className="inline-flex h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: getParticipantStatusColor(u.status),
                    }}
                  />
                  <span className="rounded px-2 py-0.5 text-sm">
                    {u.userId === currentUserId ? (
                      <>You{u.userName ? ` (${u.userName})` : ""}</>
                    ) : (
                      <>
                        {u.userName ?? "Anonymous"}{" "}
                        {u.status === "idle" ? " (idle)" : ""}
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Participants online count */}
          <span className="text-muted-foreground block text-end text-xs">
            {presentCount !== null && (
              <span className="text-muted-foreground">
                {presentCount} member
                {presentCount !== 1 ? "s" : ""} Online
              </span>
            )}
          </span>
        </div>
      </div>

      <RemoteCursorOverlay
        cursors={remoteCursors}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        canvasRef={canvasRef}
        transform={transform}
      />
    </div>
  );
}
