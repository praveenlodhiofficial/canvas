import { CanvasShape } from "@/types/shape";

/**
 * Draws an ellipse derived from a normalized bounding rectangle.
 *
 * Assumptions:
 * - x, y are top-left
 * - width > 0
 * - height > 0
 */
export function renderEllipse(
  ctx: CanvasRenderingContext2D,
  shape: Extract<CanvasShape, { type: "ellipse" }>
) {
  const cx = shape.x + shape.width / 2;
  const cy = shape.y + shape.height / 2;

  const rx = shape.width / 2;
  const ry = shape.height / 2;

  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
}
