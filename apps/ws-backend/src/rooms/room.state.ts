import { CanvasShape } from "@repo/shared/types";

export interface RoomState {
  roomId: string;
  shapes: Map<string, CanvasShape>;
  users: Set<string>;
  lastUpdated: number;
}
