import { CanvasShape } from "@repo/shared/types";
import { renderShape } from "@/lib/canvas/render-shapes";
import { normalizeShapes } from "@/lib/canvas/normalize-shapes";
import type { CanvasTheme } from "@/lib/canvas/theme";

function normalizeForRender(shape: CanvasShape): CanvasShape {
  switch (shape.type) {
    case "box":
      return normalizeShapes.box(shape);
    case "ellipse":
      return normalizeShapes.ellipse(shape);
    case "line":
      return normalizeShapes.line(shape);
    case "text":
      return normalizeShapes.text(shape);
    default:
      return shape;
  }
}

export function renderShapes(
  shapes: CanvasShape[],
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  previewShape: CanvasShape | null,
  theme: CanvasTheme,
  options?: { skipClear?: boolean }
) {
  if (!options?.skipClear) {
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Default stroke and fill for committed shapes (matches layout foreground)
  ctx.strokeStyle = theme.foreground;
  ctx.fillStyle = theme.foreground;
  ctx.lineWidth = 1.5;

  // 1️⃣ committed shapes (already normalized)
  for (const shape of shapes) {
    render(ctx, shape);
  }

  // 2️⃣ preview shape (normalize JUST for render)
  if (previewShape) {
    const shape = normalizeForRender(previewShape);

    ctx.save();

    // Preview styles (primary from layout theme)
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = theme.primary;
    ctx.fillStyle = theme.primary.includes("/") ? theme.primary : theme.primary.replace(")", " / 0.12)");

    if (shape.type === "box") {
      ctx.beginPath();
      ctx.rect(shape.x, shape.y, shape.width, shape.height);
      ctx.fill();
      ctx.stroke();
    } else if (shape.type === "ellipse") {
      ctx.beginPath();
      ctx.ellipse(shape.x + shape.width / 2, shape.y + shape.height / 2, shape.width / 2, shape.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (shape.type === "text") {
      render(ctx, shape);
    } else {
      render(ctx, shape);
    }

    if (shape.type === "box" && shape.id === "selection") {
      ctx.strokeStyle = theme.ring;
      ctx.fillStyle = theme.ring.includes("/") ? theme.ring : theme.ring.replace(")", " / 0.25)");
      ctx.beginPath();
      ctx.rect(shape.x, shape.y, shape.width, shape.height);
      ctx.fill();
      ctx.stroke();
    }

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
    case "line":
      renderShape.line(ctx, shape);
      break;
    case "text":
      renderShape.text(ctx, shape);
      break;
  }
}
