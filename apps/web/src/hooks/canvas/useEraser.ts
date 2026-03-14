import { useEffect, useRef } from "react";
import { CanvasShape } from "@repo/shared/types";
import { getBoundingBox } from "@/lib/canvas/selection/getBoundingBox";
import type { GetWorldPoint } from "./useSelection";

const HIT_PADDING = 6;

function shapeContainsPoint(shape: CanvasShape, px: number, py: number): boolean {
  const b = getBoundingBox(shape);
  return (
    px >= b.x - HIT_PADDING &&
    px <= b.x + b.width + HIT_PADDING &&
    py >= b.y - HIT_PADDING &&
    py <= b.y + b.height + HIT_PADDING
  );
}

function getShapeIdsAtPoint(
  shapes: CanvasShape[],
  px: number,
  py: number
): string[] {
  const hit = shapes.filter((s) => shapeContainsPoint(s, px, py));
  return hit.map((s) => s.id).filter((id): id is string => !!id);
}

export function useEraser(
  enabled: boolean,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  shapes: CanvasShape[],
  setShapes: React.Dispatch<React.SetStateAction<Map<string, CanvasShape>>>,
  wsRef: React.RefObject<WebSocket | null>,
  getWorldPoint: GetWorldPoint,
  setPendingEraseIds: React.Dispatch<React.SetStateAction<Set<string>>>
) {
  const shapesRef = useRef<CanvasShape[]>(shapes);
  const isErasingRef = useRef(false);
  const pendingEraseIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    shapesRef.current = shapes;
  }, [shapes]);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    function addPendingAtPoint(px: number, py: number) {
      const ids = getShapeIdsAtPoint(shapesRef.current, px, py);
      if (ids.length === 0) return;
      ids.forEach((id) => pendingEraseIdsRef.current.add(id));
      setPendingEraseIds(new Set(pendingEraseIdsRef.current));
    }

    function handleMouseDown(e: MouseEvent) {
      isErasingRef.current = true;
      pendingEraseIdsRef.current = new Set();
      const { x, y } = getWorldPoint(e);
      addPendingAtPoint(x, y);
    }

    function handleMouseMove(e: MouseEvent) {
      if (!isErasingRef.current) return;
      const { x, y } = getWorldPoint(e);
      addPendingAtPoint(x, y);
    }

    function handleMouseUp() {
      if (!isErasingRef.current) return;
      isErasingRef.current = false;
      const idsToDelete = Array.from(pendingEraseIdsRef.current);
      pendingEraseIdsRef.current = new Set();
      setPendingEraseIds(new Set());

      if (idsToDelete.length === 0) return;

      setShapes((prev) => {
        const next = new Map(prev);
        idsToDelete.forEach((id) => next.delete(id));
        return next;
      });
      wsRef.current?.send(
        JSON.stringify({ type: "shape:delete", payload: idsToDelete })
      );
    }

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [enabled, canvasRef, setShapes, setPendingEraseIds, wsRef, getWorldPoint]);
}
