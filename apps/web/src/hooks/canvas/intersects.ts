import { CanvasShape } from "@repo/shared/types";
import { getBoundingBox } from "@/lib/canvas/selection/getBoundingBox";

export function intersects(
  rect: { x: number; y: number; width: number; height: number },
  shape: CanvasShape
) {
  const rx1 = rect.x;
  const ry1 = rect.y;
  const rx2 = rect.x + rect.width;
  const ry2 = rect.y + rect.height;

  const b = getBoundingBox(shape);
  const sx1 = b.x;
  const sy1 = b.y;
  const sx2 = b.x + b.width;
  const sy2 = b.y + b.height;

  return !(rx2 < sx1 || rx1 > sx2 || ry2 < sy1 || ry1 > sy2);
}

/** True when the selection rect fully contains the shape (all of the shape is inside the rect). */
export function rectContainsShape(
  rect: { x: number; y: number; width: number; height: number },
  shape: CanvasShape
) {
  const rx1 = rect.x;
  const ry1 = rect.y;
  const rx2 = rect.x + rect.width;
  const ry2 = rect.y + rect.height;

  const b = getBoundingBox(shape);
  const sx1 = b.x;
  const sy1 = b.y;
  const sx2 = b.x + b.width;
  const sy2 = b.y + b.height;

  return sx1 >= rx1 && sy1 >= ry1 && sx2 <= rx2 && sy2 <= ry2;
}
