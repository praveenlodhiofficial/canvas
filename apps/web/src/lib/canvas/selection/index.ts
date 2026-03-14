import {
  getHandlePositionsForShape,
  ROTATE_HANDLE_HIT_RADIUS,
  ROTATE_HANDLE_OFFSET,
} from "./getHandlePositions";
import { getSelectionBounds } from "./getSelectionBounds";
import {
  renderSelectionBounds,
  renderSelectionBoundsForShape,
} from "./renderSelectionBounds";
import {
  renderSelectionHandles,
  renderSelectionHandlesForShape,
} from "./renderSelectionHandles";

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
