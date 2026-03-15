import type { CanvasShape } from "@repo/shared/types";

export type PresenceStatus = "active" | "idle" | "offline";

export type RoomUser = {
  userId: string;
  userName: string;
  status: PresenceStatus;
  lastActive: number;
};

export type RemoteSelection = {
  userId: string;
  userName: string;
  shapeIds: string[];
};

export type RoomCanvasProps = {
  initialShapes: CanvasShape[];
  roomId: string;
  roomName: string;
  /** Used to avoid showing "X joined" toast for the current user. */
  currentUserId?: string | null;
  /** Used to hide our own cursor name overlay when userId might differ. */
  currentUserName?: string | null;
};
