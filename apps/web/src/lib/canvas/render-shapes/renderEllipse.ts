import { CanvasShape } from "@repo/shared/types";
import { applyRotation } from "@/lib/canvas/applyRotation";

export function renderEllipse(
  ctx: CanvasRenderingContext2D,
  shape: Extract<CanvasShape, { type: "ellipse" }>,
) {
  const didApply = applyRotation(ctx, shape);
  const cx = shape.x + shape.width / 2;
  const cy = shape.y + shape.height / 2;
  const rx = shape.width / 2;
  const ry = shape.height / 2;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  if (didApply) ctx.restore();
}
