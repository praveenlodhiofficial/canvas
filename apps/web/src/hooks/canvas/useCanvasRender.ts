import { useEffect } from "react";
import { CanvasShape } from "@repo/shared/types";
import { renderShapes } from "@/lib/canvas";
import { ToolType } from "@/types/tool";
import { selection } from "@/lib/canvas/selection";

export function useCanvasRender(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>,
  shapes: CanvasShape[],
  previewShape: CanvasShape | null,
  tool: ToolType | null,
  selectedIds: Set<string>
) {
  // useEffect(() => {
  //   // NOTE: .current mutation doesn't trigger re-renders
  //   if (!canvasRef.current || !ctxRef.current) return;

  //   renderShapes(shapes, ctxRef.current, canvasRef.current, previewShape);
  // }, [shapes, previewShape, canvasRef, ctxRef, tool]);

  useEffect(() => {
    if (!canvasRef.current || !ctxRef.current) return;
  
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
  
    // 1️⃣ Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // 2️⃣ Render shapes + preview
    renderShapes(shapes, ctx, canvas, previewShape);
  
    // 3️⃣ Render selection overlay (VIOLET BOX)
    if (selectedIds.size > 0) {
      const selectedShapes = shapes.filter((s) =>
        s.id && selectedIds.has(s.id)
      );
  
      const bounds = selection.getBounds(selectedShapes);
  
      if (bounds) {
        selection.renderBounds(ctx, bounds);
        selection.renderHandles(ctx, bounds);
      }
    }
  }, [shapes, previewShape, selectedIds, canvasRef, ctxRef]);
}
