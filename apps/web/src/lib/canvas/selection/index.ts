import { renderSelectionBounds, renderSelectionBoundsForShape } from "./renderSelectionBounds";
import { renderSelectionHandles, renderSelectionHandlesForShape } from "./renderSelectionHandles";
import { getSelectionBounds } from "./getSelectionBounds";
import { getHandlePositionsForShape, ROTATE_HANDLE_OFFSET, ROTATE_HANDLE_HIT_RADIUS } from "./getHandlePositions";

export const selection = {
  renderBounds: renderSelectionBounds,
  renderBoundsForShape: renderSelectionBoundsForShape,
  renderHandles: renderSelectionHandles,
  renderHandlesForShape: renderSelectionHandlesForShape,
  getBounds: getSelectionBounds,
  getHandlePositionsForShape,
  ROTATE_HANDLE_OFFSET,
  ROTATE_HANDLE_HIT_RADIUS,
};
