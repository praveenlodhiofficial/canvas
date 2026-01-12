import { CanvasShape } from "@repo/shared/types";
import { ToolType } from "@/types/tool";
import { drawShape } from "./draw-shapes";

export function useCanvasTools(
  tool: ToolType,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onCommit: (shape: CanvasShape) => void,
  onPreview: (shape: CanvasShape | null) => void
) {
  drawShape.box(tool === "box", canvasRef, onCommit, onPreview);
  drawShape.ellipse(tool === "ellipse", canvasRef, onCommit, onPreview);
  drawShape.line(tool === "line", canvasRef, onCommit, onPreview);
}
