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
} from "lucide-react";

const TOOLS: { type: ToolType; label: string; icon: React.ReactNode }[] = [
  {
    type: "selection",
    label: "Select",
    icon: <MousePointer className="size-4.5 shrink-0" strokeWidth={2} />,
  },
  {
    type: "box",
    label: "Rectangle",
    icon: <Square className="size-4.5 shrink-0" strokeWidth={2} />,
  },
  {
    type: "ellipse",
    label: "Ellipse",
    icon: <Circle className="size-4.5 shrink-0" strokeWidth={2} />,
  },
  {
    type: "line",
    label: "Line",
    icon: (
      <Minus
        className="size-5 shrink-0"
        strokeWidth={2}
      />
    ),
  },
  {
    type: "triangle",
    label: "Triangle",
    icon: <Triangle className="size-4.5 shrink-0" strokeWidth={2} />,
  },
  {
    type: "pencil",
    label: "Draw",
    icon: <PenLine className="size-4.5 shrink-0" strokeWidth={2} />,
  },
  {
    type: "eraser",
    label: "Eraser",
    icon: <Eraser className="size-4.5 shrink-0" strokeWidth={2} />,
  },
];

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
        {TOOLS.map(({ type, label, icon }) => (
          <ToolButton
            key={type}
            tool={type}
            currentTool={tool}
            onSelect={setTool}
            label={label}
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
  children,
}: {
  tool: ToolType;
  currentTool: ToolType;
  onSelect: (tool: ToolType) => void;
  label: string;
  children: React.ReactNode;
}) {
  const isSelected = currentTool === tool;

  return (
    <Button
      variant="ghost"
      size="icon"
      title={label}
      aria-pressed={isSelected}
      aria-label={label}
      onClick={() => onSelect(tool)}
      className={`size-9 rounded-lg text-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring ${
        isSelected
          ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-foreground"
          : ""
      }`}
    >
      {children}
    </Button>
  );
}
