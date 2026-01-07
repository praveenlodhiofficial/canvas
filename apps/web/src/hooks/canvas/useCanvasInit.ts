import { useEffect, useRef } from "react";
import { initCanvas } from "@/lib/canvas";

export function useCanvasInit(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    ctxRef.current = initCanvas(canvasRef.current);
  });

  return ctxRef;
}
