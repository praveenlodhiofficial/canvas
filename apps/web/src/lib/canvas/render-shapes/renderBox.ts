import { CanvasShape } from "@repo/shared/types";
import { applyRotation } from "@/lib/canvas/applyRotation";

export function renderBox(
  ctx: CanvasRenderingContext2D,
  shape: Extract<CanvasShape, { type: "box" }>,
) {
  const didApply = applyRotation(ctx, shape);
  ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
  if (didApply) ctx.restore();
}
