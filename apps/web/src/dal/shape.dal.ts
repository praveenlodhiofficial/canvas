import { authFetch } from "@/lib/auth/auth-fetch";
import { config } from "@/lib/config";
import { ShapeType } from "@repo/shared/schema";
import { cache } from "react";

export const getAllShapes = cache(async (roomId: string) => {
  const data = await authFetch<{
    message: string;
    shapes: ShapeType[];
  }>(`${config.backendUrl}/api/v1/rooms/${roomId}/shapes`);

  if (!data.message) {
    console.error(data.message);
    return;
  }

  return data.shapes.map((shape) => ({
    id: shape.id,
    type: shape.type,
    x: shape.x,
    y: shape.y,
    width: shape.width,
    height: shape.height,
    radius: shape.radius,
    points: shape.points,
    style: shape.style,
  }));
});
