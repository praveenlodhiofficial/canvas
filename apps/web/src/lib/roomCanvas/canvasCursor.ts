import type { ToolType } from "@/types/tool";

export function getCanvasCursorStyle({
  isRotating,
  isOverRotateHandle,
  tool,
  hasSelection,
}: {
  isRotating: boolean;
  isOverRotateHandle: boolean;
  tool: ToolType | null;
  hasSelection: boolean;
}): string | undefined {
  if (isRotating) return "grabbing";
  if (isOverRotateHandle) return "grab";
  if (tool === "selection" && hasSelection) return "move";
  if (tool === "eraser") return "crosshair";
  if (tool === "text") return "text";
  return undefined;
}
