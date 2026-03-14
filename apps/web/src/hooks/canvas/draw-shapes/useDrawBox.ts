import React, { useEffect, useRef } from "react";

import { CanvasShape } from "@repo/shared/types";

import { normalizeShapes } from "@/lib/canvas/normalize-shapes";

import type { GetWorldPoint } from "../useSelection";

export function useDrawBox(
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

    const pos: GetWorldPoint =
      getWorldPoint ??
      ((e: MouseEvent) => {
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

      const shape: Extract<CanvasShape, { type: "box" }> = {
        id: crypto.randomUUID(),
        type: "box",
        x: start.current.x,
        y: start.current.y,
        width: x - start.current.x,
        height: y - start.current.y,
      };

      previewRef.current = shape;
      onPreview(shape);
    }

    function handleMouseUp() {
      // e:MouseEvent is not used coz we don't need it
      if (!isDrawing.current || !previewRef.current) return;
      isDrawing.current = false;

      const shape = previewRef.current;
      console.log(shape);

      // normalize the shape before committing
      const normalized = normalizeShapes.box(
        shape as Extract<CanvasShape, { type: "box" }>
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
