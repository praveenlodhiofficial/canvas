import { useDrawBox } from "./useDrawBox";
import { useDrawEllipse } from "./useDrawEllipse";
import { useDrawLine } from "./useDrawLine";
import { useDrawPencil } from "./useDrawPencil";
import { useDrawText } from "./useDrawText";
import { useDrawTriangle } from "./useDrawTriangle";
import { useSelectShapes } from "../select-shapes/useSelectShapes";

export const drawShape = {
  box: useDrawBox,
  ellipse: useDrawEllipse,
  line: useDrawLine,
  pencil: useDrawPencil,
  text: useDrawText,
  triangle: useDrawTriangle,
};

export const deleteShapes = {
  selection: useSelectShapes,
};
