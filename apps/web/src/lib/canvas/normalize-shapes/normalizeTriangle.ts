import { CanvasShape } from "@repo/shared/types";

export function normalizeTriangle(shape: Extract<CanvasShape, { type: "triangle" }>) {
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
