import type { CanvasShape } from "@repo/shared/types";
import { getBoundingBox } from "./getBoundingBox";

export const ROTATE_HANDLE_OFFSET = 24;
export const ROTATE_HANDLE_HIT_RADIUS = 14;

export type HandlePositions = {
  resizeHandles: [number, number][];
  rotateHandle: { x: number; y: number };
};

function rotatePoint(
  px: number,
  py: number,
  cx: number,
  cy: number,
  angleRad: number
): [number, number] {
  const dx = px - cx;
  const dy = py - cy;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  return [cx + dx * cos - dy * sin, cy + dx * sin + dy * cos];
}

/**
 * Returns world-space positions for the 8 resize handles and 1 rotate handle
 * so they follow the shape's rotation (drawn on the rotated bounding box).
 */
export function getHandlePositionsForShape(shape: CanvasShape): HandlePositions {
  const rotation = (shape as { rotation?: number }).rotation ?? 0;
  const angleRad = (rotation * Math.PI) / 180;

  const hasRect =
    shape.type === "box" ||
    shape.type === "ellipse" ||
    shape.type === "text" ||
    shape.type === "triangle";

  if (hasRect && rotation !== 0) {
    const w = shape.width;
    const h = shape.height;
    const cx = shape.x + w / 2;
    const cy = shape.y + h / 2;

    const localPoints: [number, number][] = [
      [shape.x, shape.y],
      [shape.x + w / 2, shape.y],
      [shape.x + w, shape.y],
      [shape.x, shape.y + h / 2],
      [shape.x + w, shape.y + h / 2],
      [shape.x, shape.y + h],
      [shape.x + w / 2, shape.y + h],
      [shape.x + w, shape.y + h],
    ];

    const resizeHandles = localPoints.map(([px, py]) =>
      rotatePoint(px, py, cx, cy, angleRad)
    ) as [number, number][];

    const topCenterX = shape.x + w / 2;
    const topCenterY = shape.y;
    const [thx, thy] = rotatePoint(topCenterX, topCenterY, cx, cy, angleRad);
    const normalX = Math.sin(angleRad);
    const normalY = -Math.cos(angleRad);
    const rotateHandle = {
      x: thx + ROTATE_HANDLE_OFFSET * normalX,
      y: thy + ROTATE_HANDLE_OFFSET * normalY,
    };

    return { resizeHandles, rotateHandle };
  }

  const bbox = getBoundingBox(shape);
  const { x, y, width, height } = bbox;
  const resizeHandles: [number, number][] = [
    [x, y],
    [x + width / 2, y],
    [x + width, y],
    [x, y + height / 2],
    [x + width, y + height / 2],
    [x, y + height],
    [x + width / 2, y + height],
    [x + width, y + height],
  ];
  const rotateHandle = {
    x: x + width / 2,
    y: y - ROTATE_HANDLE_OFFSET,
  };
  return { resizeHandles, rotateHandle };
}
