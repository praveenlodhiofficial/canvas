"use client";

import { useRef, useState } from "react";
import { CanvasShape } from "@repo/shared/types";
import { ToolType } from "@/types/tool";

import { useCanvasInit } from "@/hooks/canvas/useCanvasInit";
import { useCanvasRender } from "@/hooks/canvas/useCanvasRender";

import { useRoomWebSocket } from "@/hooks/canvas/useRoomWebSocket";
import { useKeyboardDelete } from "@/hooks/canvas/useKeyboardDelete";
import { useCanvasTools } from "@/hooks/canvas/useCanvasTools";
import { useSelection } from "@/hooks/canvas/useSelection";

import { ToolBar } from "@/components/ToolBar";

/**
 * ======================== ROOM CANVAS ORCHESTRATES ========================
 * 
 * - Canvas lifecycle
 * - Shape state
 * - WebSocket sync
 * - Tool switching
 *
 * ======================== ALL LOGIC LIVES IN HOOKS. ========================
 */
export default function RoomCanvas({
  initialShapes,
  roomId,
}: {
  initialShapes: CanvasShape[];
  roomId: string;
}) {
  /* ======================== CANVAS REFERENCES ======================== */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useCanvasInit(canvasRef);

  /* ======================== STATE ======================== */
  const [shapes, setShapes] = useState<Map<string, CanvasShape>>(
    () => new Map(initialShapes.map((s) => [s.id, s]))
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<CanvasShape | null>(null);
  const [tool, setTool] = useState<ToolType>("box");

  /* ======================== WEBSOCKET ======================== */
  const { wsRef, status } = useRoomWebSocket(roomId, setShapes);

  /* ======================== KEYBOARD DELETE ======================== */
  useKeyboardDelete(selectedIds, setShapes, wsRef, () =>
    setSelectedIds(new Set())
  );

  /* ======================== DRAW TOOLS ======================== */
  useCanvasTools(
    tool,
    canvasRef,
    (shape: CanvasShape) => {
      // optimistic UI
      setShapes((prev) => new Map(prev).set(shape.id, shape));

      // notify server
      wsRef.current?.send(
        JSON.stringify({ type: "shape:add", payload: shape })
      );
    },
    setPreview
  );

  /* ======================== SELECTION ======================== */
  useSelection(
    tool === "selection",
    canvasRef,
    Array.from(shapes.values()),
    setSelectedIds,
    setPreview
  );

  /* ======================== RENDER ======================== */
  useCanvasRender(
    canvasRef,
    ctxRef,
    Array.from(shapes.values()),
    preview,
    tool
    // selectedIds
  );

  /* ======================== CANVAS UI ======================== */
  return (
    <div className="relative w-full h-full">
      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full h-full z-10" />

      {/* Connection overlay */}
      {status !== "connected" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-20">
          <p className="text-sm font-medium">
            {status === "connecting"
              ? "Connecting to room…"
              : "Connection failed"}
          </p>
        </div>
      )}

      {/* Toolbar */}
      <ToolBar tool={tool} setTool={setTool} />
    </div>
  );
}

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { CanvasShape } from "@repo/shared/types";
// import { ToolType } from "@/types/tool";
// import { useCanvasInit } from "@/hooks/canvas/useCanvasInit";
// import { useCanvasRender } from "@/hooks/canvas/useCanvasRender";
// import { Button } from "./ui/button";
// import { Square, Circle, PenLine, Triangle, Minus, MousePointer } from "lucide-react";
// import { useDrawBox } from "@/hooks/canvas/draw-shapes/useDrawBox";
// import { useDrawEllipse } from "@/hooks/canvas/draw-shapes/useDrawEllipse";
// import { config } from "@/lib/config";
// import { useDrawLine } from "@/hooks/canvas/draw-shapes/useDrawLine";
// import { useSelectShapes } from "@/hooks/canvas/select-shapes/useSelectShapes";

// export default function RoomCanvas({
//   initialShapes,
//   roomId,
// }: {
//   initialShapes: CanvasShape[];
//   roomId: string;
// }) {
//   // Runs once when the component is mounted and never causes re-renders
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const ctxRef = useCanvasInit(canvasRef);
//   const wsRef = useRef<WebSocket | null>(null);

//   // 🔑 Shapes stored by ID to prevent duplicates
//   const [shapes, setShapes] = useState<Map<string, CanvasShape>>(
//     () => new Map(initialShapes.map((s) => [s.id, s]))
//   );

//   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

//   // State management for shapes and preview
//   const [preview, setPreview] = useState<CanvasShape | null>(null);
//   const [tool, setTool] = useState<ToolType | null>("box");
//   const [wsStatus, setWsStatus] = useState<
//     "connecting" | "connected" | "error"
//   >("connecting");

//   /* ---------------- WS CONNECTION ---------------- */
//   useEffect(() => {
//     const ws = new WebSocket(`${config.websocketUrl}?room=${roomId}`);
//     wsRef.current = ws;

//     ws.onopen = () => setWsStatus("connected");
//     ws.onerror = () => setWsStatus("error");

//     // ws.onmessage = (event) => {
//     //   const msg = JSON.parse(event.data);

//     //   // server broadcast
//     //   if (msg.type === "shape:broadcast") {
//     //     setShapes((prev) => {
//     //       const next = new Map(prev);
//     //       next.set(msg.payload.id, msg.payload);
//     //       return next;
//     //     });
//     //   }

//     //   // initial room snapshot
//     //   if (msg.type === "room:init") {
//     //     setShapes(new Map(msg.payload.map((s: CanvasShape) => [s.id, s])));
//     //   }
//     // };

//     ws.onmessage = (event) => {
//       const msg = JSON.parse(event.data);

//       if (msg.type === "room:init") {
//         setShapes(new Map(msg.payload.map((s: CanvasShape) => [s.id, s])));
//       }

//       if (msg.type === "shape:created") {
//         setShapes((prev) => {
//           const next = new Map(prev);
//           next.set(msg.payload.id, msg.payload);
//           return next;
//         });
//       }

//       if (msg.type === "shape:deleted") {
//         setShapes((prev) => {
//           const next = new Map(prev);
//           msg.payload.forEach((id: string) => next.delete(id));
//           return next;
//         });
//       }
//     };

//     return () => ws.close();
//   }, [roomId]);

//     /* ---------------- KEYBOARD DELETE ---------------- */
//     useEffect(() => {
//       function handleKeyDown(e: KeyboardEvent) {
//         if (
//           (e.key === "Backspace" || e.key === "Delete") &&
//           selectedIds.size > 0
//         ) {
//           e.preventDefault();

//           setShapes((prev) => {
//             const next = new Map(prev);
//             selectedIds.forEach((id) => next.delete(id));
//             return next;
//           });

//           wsRef.current?.send(
//             JSON.stringify({
//               type: "shape:delete",
//               payload: Array.from(selectedIds),
//             })
//           );

//           setSelectedIds(new Set());
//         }
//       }

//       window.addEventListener("keydown", handleKeyDown);
//       return () => window.removeEventListener("keydown", handleKeyDown);
//     }, [selectedIds]);

//   /* ---------------- DRAW HOOKS ---------------- */

//   useDrawBox(
//     tool === "box",
//     canvasRef,
//     (shape: CanvasShape) => {
//       // optimistic render
//       setShapes((prev) => {
//         const next = new Map(prev);
//         next.set(shape.id, shape);
//         return next;
//       });

//       // send to server
//       wsRef.current?.send(
//         JSON.stringify({
//           type: "shape:add",
//           payload: shape,
//         })
//       );
//     },
//     setPreview
//   );

//   useDrawEllipse(
//     tool === "ellipse",
//     canvasRef,
//     (shape: CanvasShape) => {
//       setShapes((prev) => {
//         const next = new Map(prev);
//         next.set(shape.id, shape);
//         return next;
//       });

//       wsRef.current?.send(
//         JSON.stringify({
//           type: "shape:add",
//           payload: shape,
//         })
//       );
//     },
//     setPreview
//   );

//   useDrawLine(
//     tool === "line",
//     canvasRef,
//     (shape: CanvasShape) => {
//       setShapes((prev) => {
//         const next = new Map(prev);
//         next.set(shape.id, shape);
//         return next;
//       });

//       wsRef.current?.send(
//         JSON.stringify({
//           type: "shape:add",
//           payload: shape,
//         })
//       );
//     },
//     setPreview
//   );

//   const shapesArray = Array.from(shapes.values());

//   useSelectShapes(
//     tool === "selection", // 👈 active only in selection mode
//     canvasRef,
//     shapesArray,
//     (ids: string[]) => {
//       setSelectedIds(new Set(ids));
//     },
//     setPreview
//   );

//   /* ---------------- RENDER ---------------- */

//   useCanvasRender(
//     canvasRef,
//     ctxRef,
//     Array.from(shapes.values()),
//     preview,
//     tool
//   );

//   return (
//     <div className="relative w-full h-full">
//       {/* Canvas */}
//       <canvas
//         ref={canvasRef}
//         className="w-full h-full cursor-auto z-10"
//         data-cursor="pencil"
//       />

//       {/* WS connection status */}
//       {wsStatus !== "connected" && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
//           <p className="text-sm font-medium">
//             {wsStatus === "connecting"
//               ? "Connecting to room…"
//               : "Connection failed"}
//           </p>
//         </div>
//       )}

//       {/* Tools */}
//       <div className="z-50 top-3 left-[50%] translate-x-[-50%] bg-white shadow-lg sketch-border absolute min-w-md h-14 justify-center flex items-center">
//         <div className="w-full h-full  gap-5 bg-muted-foreground/20 justify-center flex items-center">
//           <Button
//             variant="outline"
//             className={
//               tool === "selection"
//                 ? "bg-brand/50 sketch-border group"
//                 : "bg-white sketch-border group"
//             }
//             size="icon"
//             onClick={() => setTool("selection")}
//           >
//             <MousePointer
//               className="size-5 group-hover:size-5.5 transition-all duration-200"
//               fill="black"
//             />
//           </Button>
//           <Button
//             variant="outline"
//             className={
//               tool === "box"
//                 ? "bg-brand/50 sketch-border group"
//                 : "bg-white sketch-border group"
//             }
//             size="icon"
//             onClick={() => setTool("box")}
//           >
//             <Square
//               className="size-4.5 group-hover:size-5 transition-all duration-200"
//               fill="black"
//             />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             className={
//               tool === "ellipse"
//                 ? "bg-brand/50 sketch-border group"
//                 : "bg-white sketch-border group"
//             }
//             onClick={() => setTool("ellipse")}
//           >
//             <Circle
//               className="size-4.5 group-hover:size-5 transition-all duration-200"
//               fill="black"
//             />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             className={
//               tool === "line"
//                 ? "bg-brand/50 sketch-border group"
//                 : "bg-white sketch-border group"
//             }
//             onClick={() => setTool("line")}
//           >
//             <Minus
//               className="size-4.5 scale-140 rotate-60 group-hover:size-5 transition-all duration-200"
//               fill="black"
//             />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             className={
//               tool === "pencil"
//                 ? "bg-brand/50 sketch-border group"
//                 : "bg-white sketch-border group"
//             }
//           >
//             <PenLine
//               className="size-4.5 group-hover:size-5 transition-all duration-200"
//               fill="black"
//             />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             className={
//               tool === "triangle"
//                 ? "bg-brand/50 sketch-border group"
//                 : "bg-white sketch-border group"
//             }
//           >
//             <Triangle
//               className="size-4.5 group-hover:size-5 transition-all duration-200"
//               fill="black"
//             />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
