"use client";

import { useRef, useState } from "react";
import { CanvasShape } from "@/types/shape";
import { useCanvasInit } from "@/hooks/canvas/useCanvasInit";
import { useCanvasRender } from "@/hooks/canvas/useCanvasRender";
import { useDrawBox } from "@/hooks/canvas/draw-shapes/useDrawBox";
import { Button } from "./ui/button";
import { Square, Circle, PenLine, Triangle } from "lucide-react";
import { drawShape } from "@/hooks/canvas/draw-shapes";

export default function RoomCanvas({
  initialShapes,
}: {
  initialShapes: CanvasShape[];
}) {
  // Runs once when the component is mounted and never causes re-renders
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useCanvasInit(canvasRef);

  // State management for shapes and preview
  const [shapes, setShapes] = useState<CanvasShape[]>(initialShapes);
  const [preview, setPreview] = useState<CanvasShape | null>(null);

  // Renders the shapes and preview on the canvas
  useCanvasRender(canvasRef, ctxRef, shapes, preview);

  drawShape.box(
    canvasRef,
    (shape: CanvasShape) => setShapes((s) => [...s, shape]), 
    setPreview,                                 
  );

  // drawShape.ellipse(
  //   canvasRef,
  //   (shape: CanvasShape) => setShapes((s) => [...s, shape]), 
  //   setPreview,                                 
  // );


  return (
    <div className="relative border w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full cursor-auto" data-cursor="pencil" />
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
