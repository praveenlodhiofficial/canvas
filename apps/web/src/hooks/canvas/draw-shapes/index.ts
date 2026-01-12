import { useDrawBox } from "./useDrawBox";
import { useDrawEllipse } from "./useDrawEllipse";
import { useDrawLine } from "./useDrawLine";

export const drawShape = {
  box: useDrawBox,
  ellipse: useDrawEllipse,
  line: useDrawLine,
};
