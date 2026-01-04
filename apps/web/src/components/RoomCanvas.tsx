"use client";

import { initDraw } from "@/lib/draw";
import { useEffect, useRef } from "react";

export default function RoomCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    initDraw(canvasRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
