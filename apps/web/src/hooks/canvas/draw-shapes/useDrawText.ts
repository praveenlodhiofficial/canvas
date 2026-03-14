import { CanvasShape } from "@repo/shared/types";
import type { GetWorldPoint } from "../useSelection";
import { useEffect } from "react";

export const DEFAULT_FONT = "14px sans-serif";
export const TEXT_PADDING = 8;
export const LINE_HEIGHT = 20;

export function measureText(text: string): { width: number; height: number } {
  if (typeof document === "undefined")
    return { width: 80, height: LINE_HEIGHT };
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return { width: 80, height: LINE_HEIGHT };
  ctx.font = DEFAULT_FONT;
  const lines = text.split("\n");
  let width = 0;
  for (const line of lines) {
    const w = ctx.measureText(line).width;
    if (w > width) width = w;
  }
  return {
    width: Math.ceil(width) + TEXT_PADDING * 2,
    height: Math.max(LINE_HEIGHT, lines.length * LINE_HEIGHT) + TEXT_PADDING,
  };
}

export function useDrawText(
  enabled: boolean,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onCommit: (shape: CanvasShape) => void,
  _onPreview: (shape: CanvasShape | null) => void,
  getTextFromUser?: (x: number, y: number) => Promise<string | null>,
  getWorldPoint?: GetWorldPoint
) {
  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const pos: GetWorldPoint = getWorldPoint ?? ((e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    });

    function handleMouseDown(e: MouseEvent) {
      const { x, y } = pos(e);

      const handleText = (text: string | null) => {
        if (!text?.trim()) return;
        const { width, height } = measureText(text.trim());
        const shape: Extract<CanvasShape, { type: "text" }> = {
          id: crypto.randomUUID(),
          type: "text",
          x,
          y,
          text: text.trim(),
          width,
          height,
        };
        onCommit(shape);
      };

      if (getTextFromUser) {
        getTextFromUser(x, y).then(handleText);
      } else {
        const text = window.prompt("Enter text");
        handleText(text);
      }
    }

    canvas.addEventListener("mousedown", handleMouseDown);
    return () => canvas.removeEventListener("mousedown", handleMouseDown);
  }, [enabled, canvasRef, onCommit, getTextFromUser, getWorldPoint]);
}
