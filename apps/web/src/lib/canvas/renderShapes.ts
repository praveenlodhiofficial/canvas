import { CanvasShape } from "@repo/shared/types";
import { renderShape } from "@/lib/canvas/render-shapes";
import { normalizeShapes } from "@/lib/canvas/normalize-shapes";

function normalizeForRender(shape: CanvasShape): CanvasShape {
  switch (shape.type) {
    case "box":
      return normalizeShapes.box(shape);
    case "ellipse":
      return normalizeShapes.ellipse(shape);
    default:
      return shape;
  }
}

export function renderShapes(
  shapes: CanvasShape[],
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  previewShape: CanvasShape | null,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1️⃣ committed shapes (already normalized)
  for (const shape of shapes) {
    render(ctx, shape);
  }

  // 2️⃣ preview shape (normalize JUST for render)
  if (previewShape) {
    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.globalAlpha = 0.8;

    render(ctx, normalizeForRender(previewShape));

    ctx.restore();
  }
}

function render(ctx: CanvasRenderingContext2D, shape: CanvasShape) {
  switch (shape.type) {
    case "box":
      renderShape.box(ctx, shape);
      break;
    case "ellipse":
      renderShape.ellipse(ctx, shape);
      break;
  }
}
