import { CanvasShape } from "@repo/shared/types";

/**
 * Draws a triangle from bounding box: top-center, bottom-right, bottom-left.
 */
export function renderTriangle(
  ctx: CanvasRenderingContext2D,
  shape: Extract<CanvasShape, { type: "triangle" }>
) {
  const { x, y, width, height } = shape;
  ctx.beginPath();
  ctx.moveTo(x + width / 2, y);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.closePath();
  ctx.stroke();
}
