import { normalizeBox } from "./normalizeBox";
import { normalizeEllipse } from "./normalizeEllipse";
import { normalizeLine } from "./normalizeLine";
import { normalizeText } from "./normalizeText";

export const normalizeShapes = {
  box: normalizeBox,
  ellipse: normalizeEllipse,
  line: normalizeLine,
  text: normalizeText,
};
