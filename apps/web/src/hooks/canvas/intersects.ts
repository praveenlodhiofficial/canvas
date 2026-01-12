// lib/canvas/intersects.ts
import { CanvasShape } from "@repo/shared/types";

export function intersects(
  rect: { x: number; y: number; width: number; height: number },
  shape: CanvasShape,
) {
  const rx1 = rect.x;
  const ry1 = rect.y;
  const rx2 = rect.x + rect.width;
  const ry2 = rect.y + rect.height;

  const sx1 = shape.x;
  const sy1 = shape.y;
  const sx2 = shape.x + (shape.type === "box" ? shape.width : 0);
  const sy2 = shape.y + (shape.type === "box" ? shape.height : 0);

  return !(rx2 < sx1 || rx1 > sx2 || ry2 < sy1 || ry1 > sy2);
}
