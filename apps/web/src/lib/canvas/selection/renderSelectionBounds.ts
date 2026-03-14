import type { CanvasTheme } from "@/lib/canvas/theme";

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
  