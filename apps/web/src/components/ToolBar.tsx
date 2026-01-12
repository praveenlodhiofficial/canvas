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
} from "lucide-react";

/**
 * ToolBar
 * --------------------------------------------------
 * Pure UI component
 * - No canvas logic
 * - No websocket logic
 * - Only controls active tool
 */
export function ToolBar({
  tool,
  setTool,
}: {
  tool: ToolType;
  setTool: (tool: ToolType) => void;
}) {
  return (
    <div className="z-50 top-3 left-[50%] translate-x-[-50%] bg-white shadow-lg sketch-border absolute min-w-md h-14 justify-center flex items-center">
      <div className="w-full h-full gap-5 bg-muted-foreground/20 justify-center flex items-center">
        <ToolButton tool="selection" currentTool={tool} onSelect={setTool}>
          <MousePointer
            className="size-5 group-hover:size-5.5 transition-all duration-200"
            fill="black"
          />
        </ToolButton>

        <ToolButton tool="box" currentTool={tool} onSelect={setTool}>
          <Square
            className="size-4.5 group-hover:size-5 transition-all duration-200"
            fill="black"
          />
        </ToolButton>

        <ToolButton tool="ellipse" currentTool={tool} onSelect={setTool}>
          <Circle
            className="size-4.5 group-hover:size-5 transition-all duration-200"
            fill="black"
          />
        </ToolButton>

        <ToolButton tool="line" currentTool={tool} onSelect={setTool}>
          <Minus
            className="size-4.5 scale-140 rotate-60 group-hover:size-5 transition-all duration-200"
            fill="black"
          />
        </ToolButton>

        <ToolButton tool="pencil" currentTool={tool} onSelect={setTool}>
          <PenLine
            className="size-4.5 group-hover:size-5 transition-all duration-200"
            fill="black"
          />
        </ToolButton>

        <ToolButton tool="triangle" currentTool={tool} onSelect={setTool}>
          <Triangle
            className="size-4.5 group-hover:size-5 transition-all duration-200"
            fill="black"
          />
        </ToolButton>
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
  children,
}: {
  tool: ToolType;
  currentTool: ToolType;
  onSelect: (tool: ToolType) => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={
        currentTool === tool
          ? "bg-brand/50 sketch-border group"
          : "bg-white sketch-border group"
      }
      onClick={() => onSelect(tool)}
    >
      {children}
    </Button>
  );
}
