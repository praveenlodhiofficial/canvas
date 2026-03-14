import { normalizeShapes } from "@/lib/canvas/normalize-shapes";
import { getSelectionBounds } from "@/lib/canvas/selection/getSelectionBounds";
import { intersects } from "../intersects";
import { CanvasShape } from "@repo/shared/types";
import React, { useEffect, useRef } from "react";

function pointInRect(
  bounds: { x: number; y: number; width: number; height: number },
  point: { x: number; y: number }
): boolean {
  return (
    point.x >= bounds.x &&
    point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y <= bounds.y + bounds.height
  );
}

export function useSelectShapes(
  enabled: boolean,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  shapes: CanvasShape[],
  selectedIds: Set<string>,
  onSelect: (ids: string[]) => void,
  onPreview: (shape: CanvasShape | null) => void,
  setShapes: React.Dispatch<React.SetStateAction<Map<string, CanvasShape>>>,
  wsRef: React.RefObject<WebSocket | null>
) {
  const isDrawing = useRef(false);
  const isDragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const lastMovePos = useRef({ x: 0, y: 0 });
  const previewRef = useRef<CanvasShape | null>(null);
  const shapesRef = useRef<CanvasShape[]>(shapes);
  const dragInitialPositions = useRef<Map<string, { x: number; y: number }>>(new Map());

  useEffect(() => {
    shapesRef.current = shapes;
  }, [shapes]);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const pos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    function handleMouseDown(e: MouseEvent) {
      const point = pos(e);

      const selectedShapes = shapesRef.current.filter((s) => s.id && selectedIds.has(s.id));
      const bounds = selectedShapes.length > 0 ? getSelectionBounds(selectedShapes) : null;

      if (bounds && pointInRect(bounds, point)) {
        isDragging.current = true;
        isDrawing.current = false;
        start.current = point;
        dragInitialPositions.current = new Map(
          selectedShapes.map((s) => [s.id!, { x: s.x, y: s.y }])
        );
        return;
      }

      isDragging.current = false;
      isDrawing.current = true;
      start.current = point;
    }

    function handleMouseMove(e: MouseEvent) {
      const { x, y } = pos(e);

      if (isDragging.current) {
        lastMovePos.current = { x, y };
        const dx = x - start.current.x;
        const dy = y - start.current.y;
        const initial = dragInitialPositions.current;

        setShapes((prev) => {
          const next = new Map(prev);
          for (const id of selectedIds) {
            const shape = next.get(id);
            const init = initial.get(id);
            if (shape && init) {
              next.set(id, { ...shape, x: init.x + dx, y: init.y + dy });
            }
          }
          return next;
        });
        return;
      }

      if (!isDrawing.current) return;

      const box: Extract<CanvasShape, { type: "box" }> = {
        id: "selection",
        type: "box",
        x: start.current.x,
        y: start.current.y,
        width: x - start.current.x,
        height: y - start.current.y,
      };

      previewRef.current = box;
      onPreview(box);
    }

    function handleMouseUp() {
      if (isDragging.current) {
        const deltaX = lastMovePos.current.x - start.current.x;
        const deltaY = lastMovePos.current.y - start.current.y;
        const initial = dragInitialPositions.current;
        const current = shapesRef.current;
        for (const id of selectedIds) {
          const shape = current.find((s) => s.id === id);
          const init = initial.get(id);
          if (shape && init) {
            const updated = { ...shape, x: init.x + deltaX, y: init.y + deltaY };
            wsRef.current?.send(
              JSON.stringify({ type: "shape:update", payload: updated })
            );
          }
        }
        isDragging.current = false;
        return;
      }

      if (!isDrawing.current || !previewRef.current) return;
      isDrawing.current = false;

      const selection = normalizeShapes.box(
        previewRef.current as Extract<CanvasShape, { type: "box" }>
      );

      const idsToSelect = shapesRef.current
        .filter((shape) => intersects(selection, shape))
        .map((shape) => shape.id!)
        .filter(Boolean);

      onSelect(idsToSelect);

      previewRef.current = null;
      onPreview(null);
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
  }, [enabled, canvasRef, selectedIds, onSelect, onPreview, setShapes, wsRef]);
}
