"use client";

import type { RefObject } from "react";

import type { CanvasTransform } from "@/hooks/canvas/useCanvasZoom";

export type RemoteCursor = {
  userId: string;
  userName: string;
  x: number;
  y: number;
  lastSeen: number;
};

type RemoteCursorOverlayProps = {
  cursors: Map<string, RemoteCursor>;
  currentUserId?: string | null;
  currentUserName?: string | null;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  transform: CanvasTransform;
};

/**
 * Renders name tags for other users' cursors on the canvas.
 * Hides the current user's own cursor label.
 */
export function RemoteCursorOverlay({
  cursors,
  currentUserId = null,
  currentUserName = null,
  canvasRef,
  transform,
}: RemoteCursorOverlayProps) {
  const canvas = canvasRef.current;
  if (!canvas) return null;

  const rect = canvas.getBoundingClientRect();

  const visibleCursors = Array.from(cursors.values()).filter((cursor) => {
    const isSelfById =
      currentUserId != null && String(cursor.userId) === String(currentUserId);
    const isSelfByName =
      currentUserName != null && cursor.userName === currentUserName;
    return !isSelfById && !isSelfByName;
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      {visibleCursors.map((cursor) => {
        const x = cursor.x * transform.scale + transform.panX;
        const y = cursor.y * transform.scale + transform.panY;

        return (
          <div
            key={cursor.userId}
            className="absolute flex flex-col items-center"
            style={{
              left: rect.left + x,
              top: rect.top + y,
            }}
          >
            <span
              className="mt-0.5 rounded bg-red-500 px-1.5 py-0.5 font-medium text-white"
              style={{ fontSize: "10px" }}
            >
              {cursor.userName}
            </span>
          </div>
        );
      })}
    </div>
  );
}
