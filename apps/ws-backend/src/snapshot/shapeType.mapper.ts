import { ShapeType } from "@repo/database";
import { CanvasShape } from "@repo/shared/types";

export function mapCanvasShapeToDbType(shape: CanvasShape): ShapeType {
  switch (shape.type) {
    case "box":
      return ShapeType.BOX;
    case "ellipse":
      return ShapeType.ELLIPSE;
    case "line":
      return ShapeType.LINE;
    case "text":
      return ShapeType.TEXT;
    case "triangle":
      return ShapeType.TRIANGLE;
    default: {
      const s = shape as CanvasShape & { type: string };
      if ("text" in s && s.text != null) return ShapeType.TEXT;
      if ("points" in s && Array.isArray(s.points)) return ShapeType.LINE;
      return ShapeType.BOX;
    }
  }
}
