import { useEffect } from "react";

import type { CanvasShape } from "@repo/shared/types";

import { TOOL_BY_SHORTCUT } from "@/components/ToolBar";
import type { ToolType } from "@/types/tool";

export const useCanvasShortcuts = (
  setTool: (tool: ToolType) => void,
  setSelectedIds: (ids: Set<string>) => void,
  setPreview: (preview: CanvasShape | null) => void,
  undo: () => void,
  redo: () => void
) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as Node;
      const isInput =
        target &&
        (target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          (target instanceof HTMLElement && target.isContentEditable));
      if (isInput) return;

      const key = e.key.toLowerCase();

      if (key === "escape") {
        e.preventDefault();
        e.stopPropagation();
        setTool("selection");
        setSelectedIds(new Set());
        setPreview(null);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && key === "z") {
        e.preventDefault();
        e.stopPropagation();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && key === "y") {
        e.preventDefault();
        e.stopPropagation();
        redo();
        return;
      }

      if (!e.ctrlKey && !e.metaKey && !e.altKey && key >= "1" && key <= "8") {
        const tool = TOOL_BY_SHORTCUT[key];
        if (tool) {
          e.preventDefault();
          e.stopPropagation();
          setTool(tool);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [undo, redo, setTool, setSelectedIds, setPreview]);
};
