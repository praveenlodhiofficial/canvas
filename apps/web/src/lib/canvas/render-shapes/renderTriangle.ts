import { CanvasShape } from "@repo/shared/types";
import { applyRotation } from "@/lib/canvas/applyRotation";

export function renderTriangle(
  ctx: CanvasRenderingContext2D,
  shape: Extract<CanvasShape, { type: "triangle" }>
) {
  const didApply = applyRotation(ctx, shape);
  const { x, y, width, height } = shape;
  ctx.beginPath();
  ctx.moveTo(x + width / 2, y);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.closePath();
  ctx.stroke();
  if (didApply) ctx.restore();
}
