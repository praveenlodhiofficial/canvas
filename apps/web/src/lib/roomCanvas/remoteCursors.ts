import type { RemoteCursor } from "@/components/RemoteCursorOverlay";

export function setRemoteCursor(
  prev: Map<string, RemoteCursor>,
  userId: string,
  userName: string,
  x: number,
  y: number,
  lastSeen: number
): Map<string, RemoteCursor> {
  const next = new Map(prev);
  next.set(userId, { userId, userName, x, y, lastSeen });
  return next;
}

export function evictStaleCursors(
  prev: Map<string, RemoteCursor>,
  now: number,
  ttlMs: number
): Map<string, RemoteCursor> {
  const next = new Map(prev);
  for (const [id, cursor] of next) {
    if (now - cursor.lastSeen > ttlMs) next.delete(id);
  }
  return next;
}
