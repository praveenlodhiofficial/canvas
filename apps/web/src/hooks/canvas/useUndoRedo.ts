import { useCallback, useRef, useState } from "react";

import { CanvasShape } from "@repo/shared/types";

const MAX_HISTORY = 100;

function cloneShape(shape: CanvasShape): CanvasShape {
  if (shape.type === "line" && shape.points) {
    return { ...shape, points: shape.points.map((p) => ({ ...p })) };
  }
  return { ...shape };
}

function cloneShapesMap(
  map: Map<string, CanvasShape>
): Map<string, CanvasShape> {
  return new Map(
    Array.from(map.entries()).map(([id, s]) => [id, cloneShape(s)])
  );
}

export function useUndoRedo(initialShapes: Map<string, CanvasShape>) {
  const [shapes, setShapesState] =
    useState<Map<string, CanvasShape>>(initialShapes);

  const historyRef = useRef<Map<string, CanvasShape>[]>([
    cloneShapesMap(initialShapes),
  ]);
  const historyIndexRef = useRef(0);
  const isRestoringRef = useRef(false);
  const [, setVersion] = useState(0);

  const setShapesDirect = useCallback(
    (updater: React.SetStateAction<Map<string, CanvasShape>>) => {
      setShapesState(updater);
    },
    []
  );

  const setShapes = useCallback(
    (updater: React.SetStateAction<Map<string, CanvasShape>>) => {
      if (isRestoringRef.current) {
        setShapesState(updater);
        return;
      }
      setShapesState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        const history = historyRef.current;
        const idx = historyIndexRef.current;
        const nextClone = cloneShapesMap(next);
        const newHistory = [...history.slice(0, idx + 1), nextClone];
        if (newHistory.length > MAX_HISTORY) {
          historyRef.current = newHistory.slice(-MAX_HISTORY);
          historyIndexRef.current = historyRef.current.length - 1;
        } else {
          historyRef.current = newHistory;
          historyIndexRef.current = newHistory.length - 1;
        }
        return next;
      });
    },
    []
  );

  const undo = useCallback(() => {
    const history = historyRef.current;
    const idx = historyIndexRef.current;
    if (idx <= 0) return;
    const nextIndex = idx - 1;
    const snapshot = history[nextIndex];
    if (!snapshot) return;
    historyIndexRef.current = nextIndex;
    isRestoringRef.current = true;
    setShapesState(cloneShapesMap(snapshot));
    setVersion((v) => v + 1);
    isRestoringRef.current = false;
  }, []);

  const redo = useCallback(() => {
    const history = historyRef.current;
    const idx = historyIndexRef.current;
    if (idx >= history.length - 1) return;
    const nextIndex = idx + 1;
    const snapshot = history[nextIndex];
    if (!snapshot) return;
    historyIndexRef.current = nextIndex;
    isRestoringRef.current = true;
    setShapesState(cloneShapesMap(snapshot));
    setVersion((v) => v + 1);
    isRestoringRef.current = false;
  }, []);

  const resetHistory = useCallback((newShapes: Map<string, CanvasShape>) => {
    historyRef.current = [cloneShapesMap(newShapes)];
    historyIndexRef.current = 0;
    isRestoringRef.current = true;
    setShapesState(newShapes);
    setVersion((v) => v + 1);
    isRestoringRef.current = false;
  }, []);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  return {
    shapes,
    setShapes,
    setShapesDirect,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  };
}
