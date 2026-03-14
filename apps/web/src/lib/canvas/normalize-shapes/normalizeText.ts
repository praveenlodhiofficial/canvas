import { CanvasShape } from "@repo/shared/types";

export function normalizeText(shape: Extract<CanvasShape, { type: "text" }>) {
  return {
    ...shape,
    width: Math.max(1, shape.width),
    height: Math.max(1, shape.height),
  };
}
