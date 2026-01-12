import { CanvasShape } from "@repo/shared/types";
import { useSelectShapes } from "./select-shapes/useSelectShapes";

export function useSelection(
  enabled: boolean,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  shapes: CanvasShape[],
  setSelectedIds: (ids: Set<string>) => void,
  setPreview: (shape: CanvasShape | null) => void
) {
  useSelectShapes(
    enabled,
    canvasRef,
    shapes,
    (ids) => setSelectedIds(new Set(ids)),
    setPreview
  );
}
