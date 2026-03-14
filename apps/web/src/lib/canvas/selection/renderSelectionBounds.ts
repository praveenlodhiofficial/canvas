import type { CanvasTheme } from "@/lib/canvas/theme";
import type { CanvasShape } from "@repo/shared/types";
import { getBoundingBox } from "./getBoundingBox";

export function renderSelectionBounds(
  ctx: CanvasRenderingContext2D,
  bounds: { x: number; y: number; width: number; height: number },
  theme: CanvasTheme
) {
  ctx.save();
  ctx.strokeStyle = theme.ring;
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  ctx.restore();
}

/** Draws selection outline for one shape, with rotation so the outline follows the shape. */
export function renderSelectionBoundsForShape(
  ctx: CanvasRenderingContext2D,
  shape: CanvasShape,
  theme: CanvasTheme
) {
  ctx.save();
  ctx.strokeStyle = theme.ring;
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 4]);

  const rotation = (shape as { rotation?: number }).rotation ?? 0;

  if (
    (shape.type === "box" ||
      shape.type === "ellipse" ||
      shape.type === "text" ||
      shape.type === "triangle") &&
    rotation !== 0
  ) {
    const w = shape.width;
    const h = shape.height;
    const cx = shape.x + w / 2;
    const cy = shape.y + h / 2;
    const angleRad = (rotation * Math.PI) / 180;
    ctx.translate(cx, cy);
    ctx.rotate(angleRad);
    ctx.translate(-w / 2, -h / 2);
    ctx.strokeRect(0, 0, w, h);
  } else {
    const bbox = getBoundingBox(shape);
    ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);
  }

  ctx.restore();
}
  