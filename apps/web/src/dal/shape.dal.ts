import { authFetch } from "@/lib/auth/auth-fetch";
import { config } from "@/lib/config";
import { cache } from "react";
import type { Shape } from "@repo/shared/schema";

/**
 * DAL responsibility:
 * - Fetch initial snapshot ONCE
 * - Validate transport shape
 * - Never sync or mutate state
 */

type GetAllShapesResponse = {
  message: string;
  shapes: Shape[];
};

/**
 * Fetch all shapes for a room (initial load only)
 * After this, WebSocket is the source of truth.
 */
export const getAllShapes = cache(async (roomId: string): Promise<Shape[]> => {
  if (!roomId) return [];

  const data = await authFetch<GetAllShapesResponse>(
    `${config.backendUrl}/api/v1/rooms/${roomId}/shapes`,
  );

  if (!data || !Array.isArray(data.shapes)) {
    console.error("[shape.dal] Invalid shapes payload", data);
    return [];
  }

  /**
   * IMPORTANT:
   * Shapes are returned exactly as stored.
   * No normalization, no mapping.
   * Rendering logic relies on discriminated unions.
   */
  return data.shapes;
});

// import { authFetch } from "@/lib/auth/auth-fetch";
// import { config } from "@/lib/config";
// import { ShapeType } from "@repo/shared/schema";
// import { cache } from "react";

// export const getAllShapes = async (roomId: string): Promise<ShapeType[]> => {
//   const data = await authFetch<{
//     message: string;
//     shapes: ShapeType[];
//   }>(`${config.backendUrl}/api/v1/rooms/${roomId}/shapes`);

//   if (!data.message) {
//     console.error(data.message);
//     return;
//   }

//   return data.shapes.map((shape) => ({
//     id: shape.id,
//     type: shape.type,
//     x: shape.x,
//     y: shape.y,
//     width: shape.width,
//     height: shape.height,
//     radius: shape.radius,
//     points: shape.points,
//     style: shape.style,
//   }));
// };
