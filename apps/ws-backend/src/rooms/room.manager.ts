import { prisma } from "@repo/database";
import { CanvasShape } from "@repo/shared/types";

import { config } from "@/lib/config";
import type { RoomState } from "@/rooms/room.state";
import { mapDbShapeToCanvas } from "@/snapshot/dbShapeToCanvas";
import { memoryStore } from "@/store/memory.store";

export async function joinRoom(
  roomId: string,
  userId: string
): Promise<{
  shapes: CanvasShape[];
  userName: string;
  presentCount: number;
} | null> {
  let room = memoryStore.get(roomId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });
  if (!user) return null;
  const displayName = user.name ?? user.email ?? "Anonymous";

  const roomDetails = await prisma.room.findUnique({
    where: { id: roomId },
    select: { name: true },
  });
  if (!roomDetails) return null;

  if (config.nodeEnv === "development") {
    console.log(
      `[WS] Joined Room: ${roomDetails.name} || User: ${displayName}`
    );
  }

  if (!room) {
    room = memoryStore.create(roomId);

    /* ---------------- LOAD DB SNAPSHOT ON FIRST JOIN ---------------- */
    const shapes = await prisma.shape.findMany({
      where: { roomId },
    });

    for (const shape of shapes) {
      room.shapes.set(shape.id, mapDbShapeToCanvas(shape));
    }
  }
  room.users.add(userId);
  const shapes = Array.from(room.shapes.values());
  return {
    shapes,
    userName: displayName,
    presentCount: room.users.size,
  };
}

export async function leaveRoom(
  roomId: string,
  userId: string
): Promise<{ room: RoomState; userName: string } | null> {
  const room = memoryStore.get(roomId);
  if (!room) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });
  if (!user) return null;
  const displayName = user.name ?? user.email ?? "Anonymous";

  const roomDetails = await prisma.room.findUnique({
    where: { id: roomId },
    select: { name: true },
  });
  if (!roomDetails) return null;

  if (config.nodeEnv === "development") {
    console.log(`[WS] Left Room: ${roomDetails.name} || User: ${displayName}`);
  }

  room.users.delete(userId);
  return { room, userName: displayName };
}

export function applyShape(roomId: string, shape: CanvasShape) {
  const room = memoryStore.get(roomId);
  if (!room) return null;

  room.shapes.set(shape.id, shape);
  room.lastUpdated = Date.now();

  return room;
}
