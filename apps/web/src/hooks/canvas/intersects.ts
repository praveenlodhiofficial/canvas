import { CanvasShape } from "@repo/shared/types";

import { getBoundingBox } from "@/lib/canvas/selection/getBoundingBox";

/** Hit padding so clicking on the border (or just outside) still selects the shape. */
const BORDER_HIT_PADDING = 10;

/** True if the point is inside the shape or within BORDER_HIT_PADDING of its edge (e.g. on the border). */
export function shapeContainsPointOrBorder(
  shape: CanvasShape,
  px: number,
  py: number,
  padding: number = BORDER_HIT_PADDING
): boolean {
  const b = getBoundingBox(shape);
  return (
    px >= b.x - padding &&
    px <= b.x + b.width + padding &&
    py >= b.y - padding &&
    py <= b.y + b.height + padding
  );
}

/** Returns the topmost shape at (px, py), or null. Uses border hit padding so border clicks select. */
export function getTopmostShapeAtPoint(
  shapes: CanvasShape[],
  px: number,
  py: number
): CanvasShape | null {
  for (let i = shapes.length - 1; i >= 0; i--) {
    const s = shapes[i];
    if (!s || !s.id || s.id === "selection") continue;
    if (shapeContainsPointOrBorder(s, px, py)) return s;
  }
  return null;
}

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
