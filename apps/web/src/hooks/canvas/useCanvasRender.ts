import { useEffect } from "react";
import { CanvasShape } from "@/types/shape";
import { renderShapes } from "@/lib/canvas";

export function useCanvasRender(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>,
  shapes: CanvasShape[],
  previewShape: CanvasShape | null,
) {
  useEffect(() => {
    // NOTE: .current mutation doesn't trigger re-renders
    if (!canvasRef.current || !ctxRef.current) return;

    renderShapes(
      shapes,
      ctxRef.current,
      canvasRef.current,
      previewShape,
    );
  }, [shapes, previewShape, canvasRef, ctxRef]);
}
