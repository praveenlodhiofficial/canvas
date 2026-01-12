import { CanvasShape } from "@repo/shared/types";

export function renderLine(
  ctx: CanvasRenderingContext2D,
  shape: Extract<CanvasShape, { type: "line" }>
) {
  if (shape.points.length < 2) return;

  ctx.beginPath();

  const [first, ...rest] = shape.points;
  if (!first) return;

  ctx.moveTo(first.x + shape.x, first.y + shape.y);

  for (const p of rest) {
    ctx.lineTo(p.x + shape.x, p.y + shape.y);
  }

  ctx.stroke();
}
