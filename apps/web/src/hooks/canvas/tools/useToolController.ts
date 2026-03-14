import { useEffect } from "react";

import { CanvasShape } from "@repo/shared/types";

import { ToolType } from "@/types/tool";

import { drawShape } from "../draw-shapes";

export function useToolController(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  tool: ToolType | null,
  onCommit: (shape: CanvasShape) => void,
  onPreview: (shape: CanvasShape | null) => void
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (tool === "selection" || tool === null) return;

    switch (tool) {
      case "box":
        return drawShape.box(true, canvasRef, onCommit, onPreview);
      case "ellipse":
        return drawShape.ellipse(true, canvasRef, onCommit, onPreview);
      case "line":
        return drawShape.line(true, canvasRef, onCommit, onPreview);
    }
  }, [tool, canvasRef, onCommit, onPreview]);
}
