import { useEffect, useRef } from "react";

import { initCanvas } from "@/lib/canvas";

export function useCanvasInit(
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      ctxRef.current = initCanvas(canvas);
    };

    // Initial setup
    resize();

    // Re-init on resize
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  });

  return ctxRef;
}
