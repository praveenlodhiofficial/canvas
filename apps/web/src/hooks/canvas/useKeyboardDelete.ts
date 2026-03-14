import { useEffect } from "react";

import { CanvasShape } from "@repo/shared/types";

export function useKeyboardDelete(
  selectedIds: Set<string>,
  setShapes: React.Dispatch<React.SetStateAction<Map<string, CanvasShape>>>,
  wsRef: React.RefObject<WebSocket | null>,
  clearSelection: () => void
) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        (e.key === "Backspace" || e.key === "Delete") &&
        selectedIds.size > 0
      ) {
        e.preventDefault();

        setShapes((prev) => {
          const next = new Map(prev);
          selectedIds.forEach((id) => next.delete(id));
          return next;
        });

        wsRef.current?.send(
          JSON.stringify({
            type: "shape:delete",
            payload: Array.from(selectedIds),
          })
        );

        clearSelection();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, setShapes, wsRef, clearSelection]);
}
