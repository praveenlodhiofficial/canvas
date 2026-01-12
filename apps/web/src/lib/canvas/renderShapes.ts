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
    const shape = normalizeForRender(previewShape);
  
    ctx.save();
  
    // 🔵 preview styles
    ctx.setLineDash([6,4]); // solid border (or [6,4] if you want dashed)
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#60A5FA"; // blue-400
    ctx.fillStyle = "rgba(96, 165, 250, 0.12)"; // light sky-blue fill
  
    // TODO: Make it better (blue fill) and more generic for all shapes
    // draw filled preview manually
    if (shape.type === "box") {
      ctx.beginPath();
      ctx.rect(shape.x, shape.y, shape.width, shape.height);
      ctx.fill();    // ✅ preview fill
      ctx.stroke();  // ✅ preview border
    } else {
      render(ctx, shape);
    }

    if (shape.type === "ellipse") {
      ctx.beginPath();
      ctx.ellipse(shape.x + shape.width / 2, shape.y + shape.height / 2, shape.width / 2, shape.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();    // ✅ preview fill
      ctx.stroke();  // ✅ preview border
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
  }
}
