import { CanvasShape } from "@repo/shared/types";

export function normalizeLine(shape: Extract<CanvasShape, { type: "line" }>) {
  const xs = shape.points.map((point) => point.x);
  const ys = shape.points.map((point) => point.y);

  const minX = Math.min(...xs);
  const minY = Math.min(...ys);

  return {
    ...shape,
    x: minX,
    y: minY,
    points: shape.points.map((point) => ({
      x: point.x - minX,
      y: point.y - minY,
    })),
  };
}
