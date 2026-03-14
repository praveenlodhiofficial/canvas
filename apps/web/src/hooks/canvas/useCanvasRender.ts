import { useEffect } from "react";
import { CanvasShape } from "@repo/shared/types";
import { renderShapes } from "@/lib/canvas";
import { ToolType } from "@/types/tool";
import { selection } from "@/lib/canvas/selection";
import type { CanvasTheme } from "@/lib/canvas/theme";

export function useCanvasRender(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>,
  shapes: CanvasShape[],
  previewShape: CanvasShape | null,
  tool: ToolType | null,
  selectedIds: Set<string>,
  theme: CanvasTheme
) {
  useEffect(() => {
    if (!canvasRef.current || !ctxRef.current) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    // 1️⃣ Render shapes + preview (clears and fills background with theme)
    renderShapes(shapes, ctx, canvas, previewShape, theme);

    // 2️⃣ Render selection overlay (theme ring color)
    if (selectedIds.size > 0) {
      const selectedShapes = shapes.filter((s) => s.id && selectedIds.has(s.id));
      const bounds = selection.getBounds(selectedShapes);

      if (bounds) {
        selection.renderBounds(ctx, bounds, theme);
        selection.renderHandles(ctx, bounds, theme);
      }
    }
  }, [shapes, previewShape, selectedIds, canvasRef, ctxRef, theme]);
}
