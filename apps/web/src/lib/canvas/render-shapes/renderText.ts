import { CanvasShape } from "@repo/shared/types";
import { applyRotation } from "@/lib/canvas/applyRotation";

const FONT = "14px sans-serif";

export function renderText(
  ctx: CanvasRenderingContext2D,
  shape: Extract<CanvasShape, { type: "text" }>
) {
  const didApply = applyRotation(ctx, shape);
  ctx.font = FONT;
  ctx.textBaseline = "top";
  const lines = shape.text.split("\n");
  const lineHeight = 20;
  const padding = 8;
  let y = shape.y + padding;
  for (const line of lines) {
    ctx.fillText(line, shape.x + padding, y);
    y += lineHeight;
  }
  if (didApply) ctx.restore();
}
