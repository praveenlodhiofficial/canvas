import { CanvasShape } from "@repo/shared/types";
import { ToolType } from "@/types/tool";
import { drawShape } from "./draw-shapes";
import type { GetWorldPoint } from "./useSelection";

export function useCanvasTools(
  tool: ToolType,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onCommit: (shape: CanvasShape) => void,
  onPreview: (shape: CanvasShape | null) => void,
  getTextFromUser?: (x: number, y: number) => Promise<string | null>,
  getWorldPoint?: GetWorldPoint
) {
  drawShape.box(tool === "box", canvasRef, onCommit, onPreview, getWorldPoint);
  drawShape.ellipse(tool === "ellipse", canvasRef, onCommit, onPreview, getWorldPoint);
  drawShape.line(tool === "line", canvasRef, onCommit, onPreview, getWorldPoint);
  drawShape.triangle(tool === "triangle", canvasRef, onCommit, onPreview, getWorldPoint);
  drawShape.text(tool === "text", canvasRef, onCommit, onPreview, getTextFromUser, getWorldPoint);
}
