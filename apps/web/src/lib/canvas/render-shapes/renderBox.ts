import { CanvasShape } from "@/types/shape";

export function renderBox(
  ctx: CanvasRenderingContext2D,
  shape: Extract<CanvasShape, { type: "box" }>
) {
  ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
}