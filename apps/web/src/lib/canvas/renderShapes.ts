import { Shape } from "@/types/shape";
import { drawCircle, drawRectangle } from "@/lib/canvas/shapes";

export function renderShapes(
  shapes: Shape[],
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Render each shape
  for (const shape of shapes) {
    switch (shape.type) {
      case "rectangle":
        drawRectangle(ctx, shape);
        break;
      case "circle":
        drawCircle(ctx, shape);
        break;
    }
  }
}
