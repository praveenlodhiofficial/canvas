import { normalizeShapes } from "@/lib/canvas/normalize-shapes";
import { CanvasShape } from "@repo/shared/types";
import type { GetWorldPoint } from "../useSelection";
import { useEffect, useRef } from "react";

/** Minimum distance between points to avoid huge point lists (smoothing). */
const MIN_POINT_DISTANCE = 2;

export function useDrawPencil(
  enabled: boolean,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onCommit: (shape: CanvasShape) => void,
  onPreview: (shape: CanvasShape | null) => void,
  getWorldPoint?: GetWorldPoint
) {
  const isDrawing = useRef(false);
  const pointsRef = useRef<{ x: number; y: number }[]>([]);
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
      const p = pos(e);
      pointsRef.current = [{ x: p.x, y: p.y }];
      const shape: Extract<CanvasShape, { type: "line" }> = {
        id: crypto.randomUUID(),
        type: "line",
        x: 0,
        y: 0,
        points: [{ x: p.x, y: p.y }],
      };
      previewRef.current = shape;
      onPreview(shape);
    }

    function handleMouseMove(e: MouseEvent) {
      if (!isDrawing.current) return;
      const p = pos(e);
      const points = pointsRef.current;
      const last = points[points.length - 1];
      if (!last) return;
      const dist = Math.hypot(p.x - last.x, p.y - last.y);
      if (dist < MIN_POINT_DISTANCE) return;
      points.push({ x: p.x, y: p.y });
      const shape: Extract<CanvasShape, { type: "line" }> = {
        id: previewRef.current?.id ?? crypto.randomUUID(),
        type: "line",
        x: 0,
        y: 0,
        points: [...points],
      };
      previewRef.current = shape;
      onPreview(shape);
    }

    function handleMouseUp() {
      if (!isDrawing.current || !previewRef.current) return;
      isDrawing.current = false;
      const shape = previewRef.current as Extract<CanvasShape, { type: "line" }>;
      previewRef.current = null;
      onPreview(null);
      if (shape.points.length < 2) return;
      const normalized = normalizeShapes.line(shape);
      onCommit(normalized);
    }

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [enabled, canvasRef, onCommit, onPreview, getWorldPoint]);
}
