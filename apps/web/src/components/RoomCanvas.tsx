"use client";

import { initDraw } from "@/lib/draw";
import { Circle, PenLine, Square, Triangle } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ShapeType } from "@repo/shared/schema";
import { Shape } from "@/types/shape";

export default function RoomCanvas({ initialShapes }: { initialShapes: ShapeType[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    initDraw(canvasRef.current, initialShapes as Shape[]);
  }, []);

  return (
    <div className="relative border w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" data-cursor="pencil" />
      <div className="w-lg rounded-lg flex items-center justify-center gap-5 bg-muted-foreground/20 border sketch-border p-2 absolute top-[7%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <Button variant="secondary" size="icon" className="sketch-border group bg-white hover:bg-brand/50">
          <Square className="size-4 group-hover:size-5 transition-all duration-200" fill="black" />
        </Button>
        <Button variant="secondary" size="icon" className="sketch-border group bg-white hover:bg-brand/50">
          <Circle className="size-4 group-hover:size-5 transition-all duration-200" fill="black" />
        </Button>
        <Button variant="secondary" size="icon" className="sketch-border group bg-white hover:bg-brand/50">
          <PenLine className="size-4 group-hover:size-5 transition-all duration-200" fill="black" />
        </Button>
        <Button variant="secondary" size="icon" className="sketch-border group bg-white hover:bg-brand/50">
          <Triangle className="size-4 group-hover:size-5 transition-all duration-200" fill="black" />
        </Button>
      </div>
    </div>
  );
}
