import { CanvasShape } from "@repo/shared/types";
import { normalizeShapes } from "@/lib/canvas/normalize-shapes";

type NormalizedShape = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function assertNever(x: never): never {
  throw new Error(`Unsupported shape: ${JSON.stringify(x)}`);
}

export function getSelectionBounds(
  shapes: CanvasShape[]
): NormalizedShape | null {
  if (shapes.length === 0) return null;

  const normalized: NormalizedShape[] = shapes.map((s) => {
    const n = (() => {
      switch (s.type) {
        case "box":
          return normalizeShapes.box(s);

        case "ellipse":
          return normalizeShapes.ellipse(s);

        case "line":
          return normalizeShapes.line(s);

        case "text":
          return normalizeShapes.text(s);

        default:
          return assertNever(s);
      }
    })();

    return {
      x: n.x,
      y: n.y,
      width: "width" in n ? n.width : 0,
      height: "height" in n ? n.height : 0,
    };
  });

  const minX = Math.min(...normalized.map((s) => s.x));
  const minY = Math.min(...normalized.map((s) => s.y));
  const maxX = Math.max(...normalized.map((s) => s.x + s.width));
  const maxY = Math.max(...normalized.map((s) => s.y + s.height));

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
