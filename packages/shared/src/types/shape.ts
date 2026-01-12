export type BaseShape = {
  id: string;
  x: number;
  y: number;
};

export type CanvasBox = BaseShape & {
  type: "box";
  width: number;
  height: number;
};

export type CanvasEllipse = BaseShape & {
  type: "ellipse";
  width: number;
  height: number;
};

export type CanvasLine = BaseShape & {
  type: "line";
  points: { x: number; y: number }[];
};

export type CanvasShape = CanvasBox | CanvasEllipse | CanvasLine;
