"use client";

import { ToolType } from "@/types/tool";
import { Button } from "@/components/ui/button";
import {
  Square,
  Circle,
  Minus,
  PenLine,
  Triangle,
  MousePointer,
  Eraser,
  Type,
} from "lucide-react";

const TOOLS: { type: ToolType; label: string; shortcut: string; icon: React.ReactNode }[] = [
  { type: "selection", label: "Select", shortcut: "1", icon: <MousePointer className="size-4.5 shrink-0" strokeWidth={2} /> },
  { type: "box", label: "Rectangle", shortcut: "2", icon: <Square className="size-4.5 shrink-0" strokeWidth={2} /> },
  { type: "ellipse", label: "Ellipse", shortcut: "3", icon: <Circle className="size-4.5 shrink-0" strokeWidth={2} /> },
  { type: "line", label: "Line", shortcut: "4", icon: <Minus className="size-5 shrink-0" strokeWidth={2} /> },
  { type: "triangle", label: "Triangle", shortcut: "5", icon: <Triangle className="size-4.5 shrink-0" strokeWidth={2} /> },
  { type: "pencil", label: "Draw", shortcut: "6", icon: <PenLine className="size-4.5 shrink-0" strokeWidth={2} /> },
  { type: "eraser", label: "Eraser", shortcut: "7", icon: <Eraser className="size-4.5 shrink-0" strokeWidth={2} /> },
  { type: "text", label: "Text", shortcut: "8", icon: <Type className="size-4.5 shrink-0" strokeWidth={2} /> },
];

/** Map number key "1".."8" to tool type for keyboard shortcuts */
export const TOOL_BY_SHORTCUT: Record<string, ToolType> = Object.fromEntries(
  TOOLS.map((t) => [t.shortcut, t.type])
);

/**
 * ToolBar
 * --------------------------------------------------
 * Pure UI component – controls active tool only.
 */
export function ToolBar({
  tool,
  setTool,
}: {
  tool: ToolType;
  setTool: (tool: ToolType) => void;
}) {
  return (
    <div
      className="z-50 flex"
      role="toolbar"
      aria-label="Drawing tools"
    >
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card/95 px-2 py-2 shadow-lg shadow-black/5 backdrop-blur-md dark:border-border dark:bg-card/90 dark:shadow-black/20">
        {TOOLS.map(({ type, label, shortcut, icon }) => (
          <ToolButton
            key={type}
            tool={type}
            currentTool={tool}
            onSelect={setTool}
            label={label}
            shortcut={shortcut}
          >
            {icon}
          </ToolButton>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tool button                                                         */
/* ------------------------------------------------------------------ */

export function ToolButton({
  tool,
  currentTool,
  onSelect,
  label,
  shortcut,
  children,
}: {
  tool: ToolType;
  currentTool: ToolType;
  onSelect: (tool: ToolType) => void;
  label: string;
  shortcut: string;
  children: React.ReactNode;
}) {
  const isSelected = currentTool === tool;

  return (
    <Button
      variant="ghost"
      size="icon"
      title={`${label} (${shortcut})`}
      aria-pressed={isSelected}
      aria-label={`${label} (${shortcut})`}
      onClick={() => onSelect(tool)}
      className={`relative size-9 rounded-lg text-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring ${
        isSelected
          ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-foreground"
          : ""
      }`}
    >
      {children}
      <span
        className="absolute bottom-0.5 right-0.5 text-[8px] font-medium tabular-nums text-muted-foreground/70"
        aria-hidden
      >
        {shortcut}
      </span>
    </Button>
  );
}
