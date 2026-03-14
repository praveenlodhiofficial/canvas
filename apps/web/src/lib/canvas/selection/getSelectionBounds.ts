import { CanvasShape } from "@repo/shared/types";
import { getBoundingBox } from "./getBoundingBox";

export function getSelectionBounds(
  shapes: CanvasShape[]
): { x: number; y: number; width: number; height: number } | null {
  if (shapes.length === 0) return null;

  const boxes = shapes.map((s) => getBoundingBox(s));
  const minX = Math.min(...boxes.map((b) => b.x));
  const minY = Math.min(...boxes.map((b) => b.y));
  const maxX = Math.max(...boxes.map((b) => b.x + b.width));
  const maxY = Math.max(...boxes.map((b) => b.y + b.height));

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
