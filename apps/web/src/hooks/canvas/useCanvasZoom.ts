import { useCallback, useEffect } from "react";

export type CanvasTransform = {
  scale: number;
  panX: number;
  panY: number;
};

const MIN_SCALE = 0.25;
const MAX_SCALE = 4;
const ZOOM_SENSITIVITY = 0.008;

export function useCanvasZoom(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  setTransform: React.Dispatch<React.SetStateAction<CanvasTransform>>
) {
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      e.preventDefault();

      const rect = canvas.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      setTransform((prev) => {
        const delta = -e.deltaY * ZOOM_SENSITIVITY;
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale * (1 + delta)));

        const worldX = (cursorX - prev.panX) / prev.scale;
        const worldY = (cursorY - prev.panY) / prev.scale;

        const newPanX = cursorX - worldX * newScale;
        const newPanY = cursorY - worldY * newScale;

        return {
          scale: newScale,
          panX: newPanX,
          panY: newPanY,
        };
      });
    },
    [canvasRef, setTransform]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [canvasRef, handleWheel]);
}

export function screenToWorld(
  clientX: number,
  clientY: number,
  canvas: HTMLCanvasElement,
  transform: CanvasTransform
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left - transform.panX) / transform.scale,
    y: (clientY - rect.top - transform.panY) / transform.scale,
  };
}
