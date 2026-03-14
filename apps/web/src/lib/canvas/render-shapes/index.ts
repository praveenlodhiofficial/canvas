import { renderBox } from "./renderBox";
import { renderEllipse } from "./renderEllipse";
import { renderLine } from "./renderLine";
import { renderText } from "./renderText";
import { renderTriangle } from "./renderTriangle";

export const renderShape = {
  box: renderBox,
  ellipse: renderEllipse,
  line: renderLine,
  text: renderText,
  triangle: renderTriangle,
};
