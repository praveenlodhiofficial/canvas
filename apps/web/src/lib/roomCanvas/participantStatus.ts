import type { PresenceStatus } from "@/types/roomCanvas";

export function getParticipantStatusColor(status: PresenceStatus): string {
  switch (status) {
    case "active":
      return "#22c55e";
    case "idle":
      return "#eab308";
    case "offline":
      return "#6b7280";
    default:
      return "#6b7280";
  }
}
