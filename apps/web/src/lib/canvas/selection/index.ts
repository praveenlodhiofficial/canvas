import { renderSelectionBounds } from "./renderSelectionBounds";
import { renderSelectionHandles } from "./renderSelectionHandles";
import { getSelectionBounds } from "./getSelectionBounds";

export const selection = {
  renderBounds: renderSelectionBounds,
  renderHandles: renderSelectionHandles,
  getBounds: getSelectionBounds,
};
