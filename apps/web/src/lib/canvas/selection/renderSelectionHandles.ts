import type { CanvasShape } from "@repo/shared/types";

import type { CanvasTheme } from "@/lib/canvas/theme";

import { getHandlePositionsForShape } from "./getHandlePositions";

const HANDLE_SIZE = 8;
const ROTATE_HANDLE_RADIUS = 5;

export function renderSelectionHandles(
  ctx: CanvasRenderingContext2D,
  bounds: { x: number; y: number; width: number; height: number },
  theme: CanvasTheme
) {
  const points = [
    [bounds.x, bounds.y],
    [bounds.x + bounds.width / 2, bounds.y],
    [bounds.x + bounds.width, bounds.y],
    [bounds.x, bounds.y + bounds.height / 2],
    [bounds.x + bounds.width, bounds.y + bounds.height / 2],
    [bounds.x, bounds.y + bounds.height],
    [bounds.x + bounds.width / 2, bounds.y + bounds.height],
    [bounds.x + bounds.width, bounds.y + bounds.height],
  ];

  ctx.save();
  ctx.fillStyle = theme.ring;
  for (const [x, y] of points) {
    if (x === undefined || y === undefined) continue;
    ctx.fillRect(
      x - HANDLE_SIZE / 2,
      y - HANDLE_SIZE / 2,
      HANDLE_SIZE,
      HANDLE_SIZE
    );
  }
  ctx.beginPath();
  ctx.arc(
    bounds.x + bounds.width / 2,
    bounds.y - 24,
    ROTATE_HANDLE_RADIUS,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.restore();
}

/** Draws resize and rotate handles on the shape's rotated bounding box. */
export function renderSelectionHandlesForShape(
  ctx: CanvasRenderingContext2D,
  shape: CanvasShape,
  theme: CanvasTheme
) {
  const { resizeHandles, rotateHandle } = getHandlePositionsForShape(shape);
  ctx.save();
  ctx.fillStyle = theme.ring;
  for (const [x, y] of resizeHandles) {
    ctx.fillRect(
      x - HANDLE_SIZE / 2,
      y - HANDLE_SIZE / 2,
      HANDLE_SIZE,
      HANDLE_SIZE
    );
  }
  ctx.beginPath();
  ctx.arc(rotateHandle.x, rotateHandle.y, ROTATE_HANDLE_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
