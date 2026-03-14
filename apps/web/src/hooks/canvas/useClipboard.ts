import { useEffect, useRef } from "react";
import { CanvasShape } from "@repo/shared/types";
import { getBoundingBox } from "@/lib/canvas/selection/getBoundingBox";

function cloneShapeForPaste(shape: CanvasShape, dx: number, dy: number): CanvasShape {
  const base = {
    id: crypto.randomUUID(),
    x: shape.x + dx,
    y: shape.y + dy,
  };
  switch (shape.type) {
    case "box":
      return { ...base, type: "box", width: shape.width, height: shape.height };
    case "ellipse":
      return { ...base, type: "ellipse", width: shape.width, height: shape.height };
    case "line":
      return {
        ...base,
        type: "line",
        points: shape.points.map((p) => ({ x: p.x, y: p.y })),
      };
    case "text":
      return {
        ...base,
        type: "text",
        text: shape.text,
        width: shape.width,
        height: shape.height,
      };
    case "triangle":
      return { ...base, type: "triangle", width: shape.width, height: shape.height };
    default:
      return { ...base, type: "box", width: 100, height: 100 };
  }
}

function getClipboardCenter(clipboard: CanvasShape[]): { x: number; y: number } {
  if (clipboard.length === 0) return { x: 0, y: 0 };
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const shape of clipboard) {
    const bbox = getBoundingBox(shape);
    minX = Math.min(minX, bbox.x);
    minY = Math.min(minY, bbox.y);
    maxX = Math.max(maxX, bbox.x + bbox.width);
    maxY = Math.max(maxY, bbox.y + bbox.height);
  }
  return {
    x: minX + (maxX - minX) / 2,
    y: minY + (maxY - minY) / 2,
  };
}

export function useClipboard(
  selectedIds: Set<string>,
  shapesRef: React.RefObject<Map<string, CanvasShape>>,
  setShapes: React.Dispatch<React.SetStateAction<Map<string, CanvasShape>>>,
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>,
  wsRef: React.RefObject<WebSocket | null>,
  getPastePosition: () => { x: number; y: number }
) {
  const clipboardRef = useRef<CanvasShape[]>([]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as Node;
      const isInput = target && (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      );
      if (isInput) return;

      const isCopy = (e.ctrlKey || e.metaKey) && e.key === "c";
      const isCut = (e.ctrlKey || e.metaKey) && e.key === "x";
      const isPaste = (e.ctrlKey || e.metaKey) && e.key === "v";

      if (isCopy || isCut) {
        if (selectedIds.size === 0) return;
        const shapes = shapesRef.current;
        if (!shapes) return;

        const toCopy: CanvasShape[] = [];
        selectedIds.forEach((id) => {
          const shape = shapes.get(id);
          if (shape) toCopy.push(shape);
        });
        if (toCopy.length === 0) return;

        clipboardRef.current = toCopy.map((s) => ({ ...s }));

        if (isCut) {
          e.preventDefault();
          setShapes((prev) => {
            const next = new Map(prev);
            selectedIds.forEach((id) => next.delete(id));
            return next;
          });
          wsRef.current?.send(
            JSON.stringify({ type: "shape:delete", payload: Array.from(selectedIds) })
          );
          setSelectedIds(new Set());
        }
        return;
      }

      if (isPaste) {
        e.preventDefault();
        const clipboard = clipboardRef.current;
        if (clipboard.length === 0) return;

        const cursor = getPastePosition();
        const center = getClipboardCenter(clipboard);
        const dx = cursor.x - center.x;
        const dy = cursor.y - center.y;
        const newShapes = clipboard.map((s) => cloneShapeForPaste(s, dx, dy));
        const newIds = new Set(newShapes.map((s) => s.id));

        setShapes((prev) => {
          const next = new Map(prev);
          newShapes.forEach((s) => next.set(s.id, s));
          return next;
        });
        newShapes.forEach((shape) => {
          wsRef.current?.send(
            JSON.stringify({ type: "shape:add", payload: shape })
          );
        });
        setSelectedIds(newIds);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, shapesRef, setShapes, setSelectedIds, wsRef, getPastePosition]);
}
