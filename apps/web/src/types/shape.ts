export type CanvasBox = {
  type: "box";
  x: number;
  y: number;
  width: number;
  height: number;
};

// ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)

export type CanvasEllipse = {
  type: "ellipse";
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CanvasShape = CanvasBox | CanvasEllipse;