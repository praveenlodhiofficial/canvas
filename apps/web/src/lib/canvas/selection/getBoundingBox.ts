// lib/canvas/getBoundingBox.ts
import { CanvasShape } from "@repo/shared/types";

export function getBoundingBox(shape: CanvasShape) {
  switch (shape.type) {
    case "box":
      return normalize({
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

function normalize(r: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
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
