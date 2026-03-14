// lib/canvas/getBoundingBox.ts
import { CanvasShape } from "@repo/shared/types";

function rotatedRectAABB(
  x: number,
  y: number,
  width: number,
  height: number,
  rotationDeg: number
) {
  const r = ((rotationDeg ?? 0) * Math.PI) / 180;
  const cos = Math.cos(r);
  const sin = Math.sin(r);
  const cx = x + width / 2;
  const cy = y + height / 2;
  const dx0 = x - cx;
  const dy0 = y - cy;
  const dx1 = x + width - cx;
  const dy1 = y + height - cy;
  const corners: [number, number][] = [
    [cx + dx0 * cos - dy0 * sin, cy + dx0 * sin + dy0 * cos],
    [cx + dx1 * cos - dy0 * sin, cy + dx1 * sin + dy0 * cos],
    [cx + dx1 * cos - dy1 * sin, cy + dx1 * sin + dy1 * cos],
    [cx + dx0 * cos - dy1 * sin, cy + dx0 * sin + dy1 * cos],
  ];
  const xs = corners.map((c) => c[0]);
  const ys = corners.map((c) => c[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export function getBoundingBox(shape: CanvasShape) {
  const rot = shape.rotation ?? 0;

  switch (shape.type) {
    case "box":
      return rot !== 0
        ? rotatedRectAABB(shape.x, shape.y, shape.width, shape.height, rot)
        : normalize({
            x: shape.x,
            y: shape.y,
            width: shape.width,
            height: shape.height,
          });

    case "ellipse":
      return rot !== 0
        ? rotatedRectAABB(shape.x, shape.y, shape.width, shape.height, rot)
        : normalize({
            x: shape.x,
            y: shape.y,
            width: shape.width,
            height: shape.height,
          });

    case "text":
    case "triangle":
      return rot !== 0
        ? rotatedRectAABB(shape.x, shape.y, shape.width, shape.height, rot)
        : normalize({
            x: shape.x,
            y: shape.y,
            width: shape.width,
            height: shape.height,
          });

    case "line": {
      // 🔴 FIX: use points, not width/height
      const points = shape.points; // <-- THIS is key

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      for (const p of points) {
        minX = Math.min(minX, shape.x + p.x);
        minY = Math.min(minY, shape.y + p.y);
        maxX = Math.max(maxX, shape.x + p.x);
        maxY = Math.max(maxY, shape.y + p.y);
      }

      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    }

    default:
      return { x: 0, y: 0, width: 0, height: 0 };
  }
}

function normalize(r: { x: number; y: number; width: number; height: number }) {
  const x1 = Math.min(r.x, r.x + r.width);
  const y1 = Math.min(r.y, r.y + r.height);
  const x2 = Math.max(r.x, r.x + r.width);
  const y2 = Math.max(r.y, r.y + r.height);

  return {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1,
  };
}
