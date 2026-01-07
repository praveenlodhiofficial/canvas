type StyleProps = {
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
};

type BaseShapes = {
  x: number;
  y: number;
};

export type Rectangle = BaseShapes & StyleProps & {
    type: "rectangle";
    width: number;
    height: number;
};

export type Circle = BaseShapes & StyleProps & {
    type: "circle";
    radius: number;
};

export type Line = BaseShapes & StyleProps & {
    type: "line";
    points: { x: number; y: number }[];
};

export type Shape = Rectangle | Circle;