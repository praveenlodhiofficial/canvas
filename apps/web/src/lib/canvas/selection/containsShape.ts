// lib/canvas/containsShape.ts
import { CanvasShape } from "@repo/shared/types";
import { getBoundingBox } from "./getBoundingBox";

export function containsShape(
  selection: { x: number; y: number; width: number; height: number },
  shape: CanvasShape
) {
  const sel = normalize(selection);
  const shp = normalize(getBoundingBox(shape));

  return (
    sel.x1 <= shp.x1 &&
    sel.y1 <= shp.y1 &&
    sel.x2 >= shp.x2 &&
    sel.y2 >= shp.y2
  );
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
  return { x1, y1, x2, y2 };
}
