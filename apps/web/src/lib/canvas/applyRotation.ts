import { CanvasShape } from "@repo/shared/types";

/**
 * Applies rotation around the shape's center (if rotation is set).
 * Call ctx.restore() after drawing when this returns true.
 */
export function applyRotation(
  ctx: CanvasRenderingContext2D,
  shape: CanvasShape
): boolean {
  const rotation = "rotation" in shape ? (shape.rotation ?? 0) : 0;
  if (rotation === 0) return false;

  let cx: number;
  let cy: number;

  switch (shape.type) {
    case "box":
    case "ellipse":
    case "text":
    case "triangle":
      cx = shape.x + shape.width / 2;
      cy = shape.y + shape.height / 2;
      break;
    case "line":
      return false;
    default:
      return false;
  }

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-cx, -cy);
  return true;
}
