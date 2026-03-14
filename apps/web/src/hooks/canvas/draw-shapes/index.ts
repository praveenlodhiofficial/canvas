import { useDrawBox } from "./useDrawBox";
import { useDrawEllipse } from "./useDrawEllipse";
import { useDrawLine } from "./useDrawLine";
import { useDrawText } from "./useDrawText";
import { useSelectShapes } from "../select-shapes/useSelectShapes";

export const drawShape = {
  box: useDrawBox,
  ellipse: useDrawEllipse,
  line: useDrawLine,
  text: useDrawText,
};

export const deleteShapes = {
  selection: useSelectShapes,
};
