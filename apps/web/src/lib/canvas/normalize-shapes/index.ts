import { normalizeBox } from "./normalizeBox";
import { normalizeEllipse } from "./normalizeEllipse";
import { normalizeLine } from "./normalizeLine";

export const normalizeShapes = {
  box: normalizeBox,
  ellipse: normalizeEllipse,
  line: normalizeLine,
};
