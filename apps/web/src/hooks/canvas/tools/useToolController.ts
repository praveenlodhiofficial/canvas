import { CanvasShape } from "@/types/shape";
import { ToolType } from "@/types/tool";
import { useEffect } from "react";
import { drawShape } from "../draw-shapes";

export function useToolController(
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    tool: ToolType | null,
    onCommit: (shape: CanvasShape) => void,
    onPreview: (shape: CanvasShape | null) => void,
) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        switch (tool) {
            case "box":
                drawShape.box(true, canvasRef, onCommit, onPreview);
                break;
            case "ellipse":
                drawShape.ellipse(true, canvasRef, onCommit, onPreview);
                break;
            default:
                break;
        }
    }, [tool, canvasRef, onCommit, onPreview]);
}