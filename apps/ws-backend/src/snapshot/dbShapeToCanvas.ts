import { CanvasShape } from "@repo/shared/types";

type DbShape = {
  id: string;
  type: string | null;
  x: number;
  y: number;
  width: number | null;
  height: number | null;
  points: unknown;
  text: string | null;
};

/** Map DB Shape (uppercase type) to client CanvasShape (lowercase type). */
export function mapDbShapeToCanvas(shape: DbShape): CanvasShape {
  const type = shape.type?.toLowerCase() as CanvasShape["type"];
  const base = {
    id: shape.id,
    x: shape.x,
    y: shape.y,
  };
  if (type === "text" && shape.text != null) {
    return {
      ...base,
      type: "text",
      text: shape.text,
      width: shape.width ?? 80,
      height: shape.height ?? 24,
    };
  }
  if (type === "box" && shape.width != null && shape.height != null) {
    return { ...base, type: "box", width: shape.width, height: shape.height };
  }
  if (type === "ellipse" && shape.width != null && shape.height != null) {
    return { ...base, type: "ellipse", width: shape.width, height: shape.height };
  }
  if (type === "line" && shape.points != null && Array.isArray(shape.points)) {
    return { ...base, type: "line", points: shape.points as { x: number; y: number }[] };
  }
  if (type === "triangle" && shape.width != null && shape.height != null) {
    return { ...base, type: "triangle", width: shape.width, height: shape.height };
  }
  return { ...base, type: type ?? "box", width: shape.width ?? 0, height: shape.height ?? 0 } as CanvasShape;
}
