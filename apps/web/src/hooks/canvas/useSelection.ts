import { CanvasShape } from "@repo/shared/types";

import { useSelectShapes } from "./select-shapes/useSelectShapes";

export type GetWorldPoint = (e: MouseEvent) => { x: number; y: number };

export function useSelection(
  enabled: boolean,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  shapes: CanvasShape[],
  selectedIds: Set<string>,
  setSelectedIds: (ids: Set<string>) => void,
  setPreview: (shape: CanvasShape | null) => void,
  setShapes: React.Dispatch<React.SetStateAction<Map<string, CanvasShape>>>,
  wsRef: React.RefObject<WebSocket | null>,
  getWorldPoint: GetWorldPoint
) {
  return useSelectShapes(
    enabled,
    canvasRef,
    shapes,
    selectedIds,
    (ids) => setSelectedIds(new Set(ids)),
    setPreview,
    setShapes,
    wsRef,
    getWorldPoint
  );
}
