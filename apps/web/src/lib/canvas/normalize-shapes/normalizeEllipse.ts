/**
 * Normalizes the ellipse shape by:
 * 1. Fixing the origin if user dragged left/up
 * 2. Normalizing the width and height to positive values
 */

import { CanvasShape } from "@/types/shape";

export function normalizeEllipse(
  shape: Extract<CanvasShape, { type: "ellipse" }>
) {
  const x = shape.width < 0 ? shape.x + shape.width : shape.x;
  const y = shape.height < 0 ? shape.y + shape.height : shape.y;

  return {
    ...shape,
    x,
    y,
    width: Math.abs(shape.width),
    height: Math.abs(shape.height),
  };
}
