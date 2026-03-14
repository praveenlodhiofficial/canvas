import type { Shape } from "@repo/shared/schema";

import { getAllShapes } from "@/dal/shape.dal";

/**
 * Server Action
 * ----------------
 * - Called ONCE when user enters a room
 * - Fetches initial snapshot from DB
 * - WebSocket takes over after this
 */

export async function getRoomShapesAction(roomId: string): Promise<Shape[]> {
  if (!roomId) {
    throw new Error("Room ID is required");
  }

  try {
    const shapes = await getAllShapes(roomId);
    return shapes;
  } catch {
    // console.log("[getRoomShapesAction] Failed to fetch shapes", error);
    return [];
  }
}
