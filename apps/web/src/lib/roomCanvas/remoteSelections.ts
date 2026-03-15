import type { RemoteSelection } from "@/types/roomCanvas";

export function setRemoteSelection(
  prev: Map<string, RemoteSelection>,
  userId: string,
  userName: string,
  shapeIds: string[]
): Map<string, RemoteSelection> {
  const next = new Map(prev);
  next.set(userId, { userId, userName, shapeIds });
  return next;
}

export function clearRemoteSelection(
  prev: Map<string, RemoteSelection>,
  userId: string
): Map<string, RemoteSelection> {
  const next = new Map(prev);
  next.delete(userId);
  return next;
}
