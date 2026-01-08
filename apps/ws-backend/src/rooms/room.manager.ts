import { memoryStore } from "@/store/memory.store";
import { prisma } from "@repo/database";
import { CanvasShape } from "@repo/shared/types";

export async function joinRoom(roomId: string, userId: string) {
  let room = memoryStore.get(roomId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });
  if (!user) return null;


  const roomDetails = await prisma.room.findUnique({
    where: { id: roomId },
    select: { name: true },
  }); 
  if (!roomDetails) return null;

  console.log(`[WS] Joined Room: ${roomDetails.name} || User: ${user.name}`);

  if (!room) {
    room = memoryStore.create(roomId);

    /* ---------------- LOAD DB SNAPSHOT ON FIRST JOIN ---------------- */
    const shapes = await prisma.shape.findMany({
      where: { roomId },
    });

    for (const shape of shapes) {
      room.shapes.set(shape.id, shape as unknown as CanvasShape);
    }
  }
  room.users.add(userId);
  return Array.from(room.shapes.values());
}

export async function leaveRoom(roomId: string, userId: string) {
  const room = memoryStore.get(roomId);
  if (!room) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });
  if (!user) return null;

  const roomDetails = await prisma.room.findUnique({
    where: { id: roomId },
    select: { name: true },
  });
  if (!roomDetails) return null;

  console.log(`[WS] Left Room: ${roomDetails.name} || User: ${user.name}`);

  room.users.delete(userId);
  return room;
}

export function applyShape(roomId: string, shape: CanvasShape) {
  const room = memoryStore.get(roomId);
  if (!room) return null;

  room.shapes.set(shape.id, shape);
  room.lastUpdated = Date.now();

  return room;
}
