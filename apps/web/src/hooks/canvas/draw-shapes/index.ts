import { useDrawBox } from "./useDrawBox";
import { useDrawEllipse } from "./useDrawEllipse";
import { useDrawLine } from "./useDrawLine";
import { useSelectShapes } from "../select-shapes/useSelectShapes";

export const drawShape = {
  box: useDrawBox,
  ellipse: useDrawEllipse,
  line: useDrawLine,
};

export const deleteShapes = {
  selection: useSelectShapes,
};
