import { useEffect } from "react";

import { CanvasShape } from "@repo/shared/types";

import { renderShapes } from "@/lib/canvas";
import { selection } from "@/lib/canvas/selection";
import type { CanvasTheme } from "@/lib/canvas/theme";
import { ToolType } from "@/types/tool";

import type { CanvasTransform } from "./useCanvasZoom";

export function useCanvasRender(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>,
  shapes: CanvasShape[],
  previewShape: CanvasShape | null,
  tool: ToolType | null,
  selectedIds: Set<string>,
  pendingEraseIds: Set<string>,
  theme: CanvasTheme,
  transform: CanvasTransform
) {
  useEffect(() => {
    if (!canvasRef.current || !ctxRef.current) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const { scale, panX, panY } = transform;

    ctx.save();

    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.translate(panX, panY);
    ctx.scale(scale, scale);

    renderShapes(shapes, ctx, canvas, previewShape, theme, {
      skipClear: true,
      pendingEraseIds,
    });

    if (selectedIds.size > 0) {
      const selectedShapes = shapes.filter(
        (s) => s.id && selectedIds.has(s.id)
      );
      for (const shape of selectedShapes) {
        selection.renderBoundsForShape(ctx, shape, theme);
        selection.renderHandlesForShape(ctx, shape, theme);
      }
    }

    ctx.restore();
  }, [
    shapes,
    previewShape,
    selectedIds,
    pendingEraseIds,
    canvasRef,
    ctxRef,
    theme,
    transform,
  ]);
}
