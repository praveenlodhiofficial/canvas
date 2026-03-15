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
  transform: CanvasTransform,
  remoteSelections: {
    userId: string;
    userName: string;
    color: string;
    shapeIds: string[];
  }[] = []
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

    if (remoteSelections.length > 0) {
      for (const sel of remoteSelections) {
        const selectedShapes = shapes.filter((s) =>
          sel.shapeIds.includes(s.id)
        );
        if (!selectedShapes.length) continue;
        const bounds = selection.getSelectionBounds(selectedShapes);
        if (!bounds) continue;

        ctx.save();
        ctx.strokeStyle = sel.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

        const label = `${sel.userName} selected`;
        ctx.font = "12px system-ui";
        const padding = 4;
        const textWidth = ctx.measureText(label).width;
        const w = textWidth + padding * 2;
        const h = 18;

        const labelX = bounds.x;
        const labelY = bounds.y - h - 4;

        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(labelX, labelY, w, h);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(label, labelX + padding, labelY + h - 6);

        ctx.restore();
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
    remoteSelections,
  ]);
}
