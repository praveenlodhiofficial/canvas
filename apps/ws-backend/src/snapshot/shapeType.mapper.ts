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

  }
}
