import { Shape } from "@/types/shape";

export function drawRectangle(
  ctx: CanvasRenderingContext2D,
  shape: Extract<Shape, { type: "rectangle" }>
) {
  ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
}
