export type BaseShape = {
  id: string;
  x: number;
  y: number;
  /** Rotation in degrees (0–360), applied around the shape's center. Default 0. */
  rotation?: number;
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

export type CanvasText = BaseShape & {
  type: "text";
  text: string;
  width: number;
  height: number;
};

export type CanvasTriangle = BaseShape & {
  type: "triangle";
  width: number;
  height: number;
};

export type CanvasShape =
  | CanvasBox
  | CanvasEllipse
  | CanvasLine
  | CanvasText
  | CanvasTriangle;
