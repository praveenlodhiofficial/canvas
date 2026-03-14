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
  rotation?: number | null;
};

const withRotation = (shape: DbShape) => (base: Record<string, unknown>) => ({
  ...base,
  rotation: shape.rotation ?? 0,
});

/** Map DB Shape (uppercase type) to client CanvasShape (lowercase type). */
export function mapDbShapeToCanvas(shape: DbShape): CanvasShape {
  const type = shape.type?.toLowerCase() as CanvasShape["type"];
  const base = withRotation(shape)({
    id: shape.id,
    x: shape.x,
    y: shape.y,
  });
  if (type === "text" && shape.text != null) {
    return {
      ...base,
      type: "text",
      text: shape.text,
      width: shape.width ?? 80,
      height: shape.height ?? 24,
    } as CanvasShape;
  }
  if (type === "box" && shape.width != null && shape.height != null) {
    return {
      ...base,
      type: "box",
      width: shape.width,
      height: shape.height,
    } as CanvasShape;
  }
  if (type === "ellipse" && shape.width != null && shape.height != null) {
    return {
      ...base,
      type: "ellipse",
      width: shape.width,
      height: shape.height,
    } as CanvasShape;
  }
  if (type === "line" && shape.points != null && Array.isArray(shape.points)) {
    return {
      ...base,
      type: "line",
      points: shape.points as { x: number; y: number }[],
    } as CanvasShape;
  }
  if (type === "triangle" && shape.width != null && shape.height != null) {
    return {
      ...base,
      type: "triangle",
      width: shape.width,
      height: shape.height,
    } as CanvasShape;
  }
  return {
    ...base,
    type: type ?? "box",
    width: shape.width ?? 0,
    height: shape.height ?? 0,
  } as CanvasShape;
}
