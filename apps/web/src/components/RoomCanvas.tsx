"use client";

import { useEffect, useRef, useState } from "react";
import { CanvasShape } from "@/types/shape";
import { ToolType } from "@/types/tool";
import { useCanvasInit } from "@/hooks/canvas/useCanvasInit";
import { useCanvasRender } from "@/hooks/canvas/useCanvasRender";
import { Button } from "./ui/button";
import { Square, Circle, PenLine, Triangle } from "lucide-react";
import { useDrawBox } from "@/hooks/canvas/draw-shapes/useDrawBox";
import { useDrawEllipse } from "@/hooks/canvas/draw-shapes/useDrawEllipse";
import { config } from "@/lib/config";

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

  // State management for shapes and preview
  const [shapes, setShapes] = useState<CanvasShape[]>(initialShapes);
  const [preview, setPreview] = useState<CanvasShape | null>(null);
  const [tool, setTool] = useState<ToolType | null>("box");

  // ws coonection
  const [wsStatus, setWsStatus] = useState<
    "connecting" | "connected" | "error" | "disconnected"
  >("connecting");

  // WS connection (side-effect, correct use)
  useEffect(() => {
    const ws = new WebSocket(`${config.websocketUrl}?room=${roomId}`);

    ws.onopen = () => setWsStatus("connected");
    ws.onerror = () => setWsStatus("error");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "shape:add") {
        setShapes((s) => [...s, msg.shape]);
      }
    };

    return () => ws.close();
  }, [roomId]);

  useDrawBox(
    tool === "box",
    canvasRef,
    (shape: CanvasShape) => setShapes((s) => [...s, shape]),
    setPreview
  );

  useDrawEllipse(
    tool === "ellipse",
    canvasRef,
    (shape: CanvasShape) => setShapes((s) => [...s, shape]),
    setPreview
  );
  // 🔼 🔼 🔼 END DRAW HOOKS 🔼 🔼 🔼

  useCanvasRender(canvasRef, ctxRef, shapes, preview, tool);

  return (
    <div className="relative border w-full h-full">

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-auto"
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
      <div className="w-lg rounded-lg flex items-center justify-center gap-5 bg-muted-foreground/20 border sketch-border p-2 absolute top-[7%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
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
  );
}
