import { normalizeShapes } from "@/lib/canvas/normalize-shapes";
import { CanvasShape } from "@repo/shared/types";
import type { GetWorldPoint } from "../useSelection";
import React, { useEffect, useRef } from "react";

export function useDrawTriangle(
  enabled: boolean,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onCommit: (shape: CanvasShape) => void,
  onPreview: (shape: CanvasShape | null) => void,
  getWorldPoint?: GetWorldPoint
) {
  const isDrawing = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const previewRef = useRef<CanvasShape | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const pos: GetWorldPoint = getWorldPoint ?? ((e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    });

    function handleMouseDown(e: MouseEvent) {
      isDrawing.current = true;
      start.current = pos(e);
    }

    function handleMouseMove(e: MouseEvent) {
      if (!isDrawing.current) return;
      const { x, y } = pos(e);

      const shape: Extract<CanvasShape, { type: "triangle" }> = {
        id: crypto.randomUUID(),
        type: "triangle",
        x: start.current.x,
        y: start.current.y,
        width: x - start.current.x,
        height: y - start.current.y,
      };

      previewRef.current = shape;
      onPreview(shape);
    }

    function handleMouseUp() {
      if (!isDrawing.current || !previewRef.current) return;
      isDrawing.current = false;

      const shape = previewRef.current;
      const normalized = normalizeShapes.triangle(
        shape as Extract<CanvasShape, { type: "triangle" }>
      );

      onCommit(normalized);

      previewRef.current = null;
      onPreview(null);
    }

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [enabled, canvasRef, onCommit, onPreview, getWorldPoint]);
}
