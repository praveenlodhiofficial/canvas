import type { PresenceStatus, RoomUser } from "@/types/roomCanvas";

export function addOrUpdateUser(
  prev: Map<string, RoomUser>,
  userId: string,
  userName: string,
  status: PresenceStatus,
  lastActive: number
): Map<string, RoomUser> {
  const next = new Map(prev);
  next.set(userId, { userId, userName, status, lastActive });
  return next;
}

export function setUserOffline(
  prev: Map<string, RoomUser>,
  userId: string,
  userName: string
): Map<string, RoomUser> {
  const next = new Map(prev);
  const existing = next.get(userId);
  if (existing) {
    next.set(userId, { ...existing, status: "offline" });
  } else {
    next.set(userId, {
      userId,
      userName,
      status: "offline",
      lastActive: Date.now(),
    });
  }
  return next;
}

export function markUsersIdle(
  prev: Map<string, RoomUser>,
  now: number,
  idleAfterMs: number
): Map<string, RoomUser> {
  const next = new Map(prev);
  for (const [id, user] of next) {
    if (user.status !== "offline" && now - user.lastActive > idleAfterMs) {
      next.set(id, { ...user, status: "idle" });
    }
  }
  return next;
}
