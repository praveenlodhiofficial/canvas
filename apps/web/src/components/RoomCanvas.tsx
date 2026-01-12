"use client";

import { useEffect, useRef, useState } from "react";
import { CanvasShape } from "@repo/shared/types";
import { ToolType } from "@/types/tool";
import { useCanvasInit } from "@/hooks/canvas/useCanvasInit";
import { useCanvasRender } from "@/hooks/canvas/useCanvasRender";
import { Button } from "./ui/button";
import { Square, Circle, PenLine, Triangle, Minus } from "lucide-react";
import { useDrawBox } from "@/hooks/canvas/draw-shapes/useDrawBox";
import { useDrawEllipse } from "@/hooks/canvas/draw-shapes/useDrawEllipse";
import { config } from "@/lib/config";
import { useDrawLine } from "@/hooks/canvas/draw-shapes/useDrawLine";

export default function RoomCanvas({
  initialShapes,
  roomId,
}: {
  initialShapes: CanvasShape[];
  roomId: string;
}) {
  // Runs once when the component is mounted and never causes re-renders
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useCanvasInit(canvasRef);
  const wsRef = useRef<WebSocket | null>(null);

  // 🔑 Shapes stored by ID to prevent duplicates
  const [shapes, setShapes] = useState<Map<string, CanvasShape>>(
    () => new Map(initialShapes.map((s) => [s.id, s]))
  );

  // State management for shapes and preview
  const [preview, setPreview] = useState<CanvasShape | null>(null);
  const [tool, setTool] = useState<ToolType | null>("box");
  const [wsStatus, setWsStatus] = useState<
    "connecting" | "connected" | "error"
  >("connecting");

  /* ---------------- WS CONNECTION ---------------- */
  useEffect(() => {
    const ws = new WebSocket(`${config.websocketUrl}?room=${roomId}`);
    wsRef.current = ws;

    ws.onopen = () => setWsStatus("connected");
    ws.onerror = () => setWsStatus("error");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      // server broadcast
      if (msg.type === "shape:broadcast") {
        setShapes((prev) => {
          const next = new Map(prev);
          next.set(msg.payload.id, msg.payload);
          return next;
        });
      }

      // initial room snapshot
      if (msg.type === "room:init") {
        setShapes(new Map(msg.payload.map((s: CanvasShape) => [s.id, s])));
      }
    };

    return () => ws.close();
  }, [roomId]);

  /* ---------------- DRAW HOOKS ---------------- */

  useDrawBox(
    tool === "box",
    canvasRef,
    (shape: CanvasShape) => {
      // optimistic render
      setShapes((prev) => {
        const next = new Map(prev);
        next.set(shape.id, shape);
        return next;
      });

      // send to server
      wsRef.current?.send(
        JSON.stringify({
          type: "shape:add",
          payload: shape,
        })
      );
    },
    setPreview
  );

  useDrawEllipse(
    tool === "ellipse",
    canvasRef,
    (shape: CanvasShape) => {
      setShapes((prev) => {
        const next = new Map(prev);
        next.set(shape.id, shape);
        return next;
      });

      wsRef.current?.send(
        JSON.stringify({
          type: "shape:add",
          payload: shape,
        })
      );
    },
    setPreview
  );

  useDrawLine(
    tool === "line",
    canvasRef,
    (shape: CanvasShape) => {
      setShapes((prev) => {
        const next = new Map(prev);
        next.set(shape.id, shape);
        return next;
      });

      wsRef.current?.send(
        JSON.stringify({
          type: "shape:add",
          payload: shape,
        })
      );
    },
    setPreview
  );

  /* ---------------- RENDER ---------------- */

  useCanvasRender(
    canvasRef,
    ctxRef,
    Array.from(shapes.values()),
    preview,
    tool
  );

  return (
    <div className="relative w-full h-full">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-auto z-10"
        data-cursor="pencil"
      />

      {/* WS connection status */}
      {wsStatus !== "connected" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <p className="text-sm font-medium">
            {wsStatus === "connecting"
              ? "Connecting to room…"
              : "Connection failed"}
          </p>
        </div>
      )}

      {/* Tools */}
      <div className="z-50 top-3 left-[50%] translate-x-[-50%] bg-white shadow-lg sketch-border absolute min-w-md h-14 justify-center flex items-center">
        <div className="w-full h-full  gap-5 bg-muted-foreground/20 justify-center flex items-center">
          <Button
            variant="outline"
            className={
              tool === "box"
                ? "bg-brand/50 sketch-border group"
                : "bg-white sketch-border group"
            }
            size="icon"
            onClick={() => setTool("box")}
          >
            <Square
              className="size-4.5 group-hover:size-5 transition-all duration-200"
              fill="black"
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={
              tool === "ellipse"
                ? "bg-brand/50 sketch-border group"
                : "bg-white sketch-border group"
            }
            onClick={() => setTool("ellipse")}
          >
            <Circle
              className="size-4.5 group-hover:size-5 transition-all duration-200"
              fill="black"
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={
              tool === "line"
                ? "bg-brand/50 sketch-border group"
                : "bg-white sketch-border group"
            }
            onClick={() => setTool("line")}
          >
            <Minus
              className="size-4.5 scale-140 rotate-60 group-hover:size-5 transition-all duration-200"
              fill="black"
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={
              tool === "pencil"
                ? "bg-brand/50 sketch-border group"
                : "bg-white sketch-border group"
            }
          >
            <PenLine
              className="size-4.5 group-hover:size-5 transition-all duration-200"
              fill="black"
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={
              tool === "triangle"
                ? "bg-brand/50 sketch-border group"
                : "bg-white sketch-border group"
            }
          >
            <Triangle
              className="size-4.5 group-hover:size-5 transition-all duration-200"
              fill="black"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
