import { CanvasShape } from "@repo/shared/types";

export function renderBox(
  ctx: CanvasRenderingContext2D,
  shape: Extract<CanvasShape, { type: "box" }>,
) {
  ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
}
