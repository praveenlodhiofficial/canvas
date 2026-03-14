import { prisma, ShapeType } from "@repo/database";
import { CanvasShape } from "@repo/shared/types";

import { config } from "../lib/config";
import { RoomState } from "../rooms/room.state";
import { mapCanvasShapeToDbType } from "./shapeType.mapper";

function shapeToDbRow(shape: CanvasShape, roomId: string) {
  const dbType = mapCanvasShapeToDbType(shape);
  const rotation = (shape as { rotation?: number }).rotation ?? 0;
  const row: {
    id: string;
    type: ShapeType;
    x: number;
    y: number;
    width: number | null;
    height: number | null;
    roomId: string;
    rotation?: number;
    points?: { x: number; y: number }[];
    text?: string | null;
  } = {
    id: shape.id,
    type: dbType,
    x: shape.x,
    y: shape.y,
    width: "width" in shape ? shape.width : null,
    height: "height" in shape ? shape.height : null,
    roomId,
    rotation,
  };
  if ("points" in shape && shape.points?.length) {
    row.points = shape.points;
  }
  if (dbType === ShapeType.TEXT && "text" in shape) {
    row.text = shape.text ?? null;
  }
  return row;
}

export async function snapshotRoom(room: RoomState) {
  const shapes = Array.from(room.shapes.values());

  await prisma.shape.deleteMany({
    where: { roomId: room.roomId },
  });

  if (shapes.length > 0) {
    const rows = shapes.map((shape: CanvasShape) =>
      shapeToDbRow(shape, room.roomId)
    );
    await prisma.shape.createMany({ data: rows });
  }

  if (config.nodeEnv === "development") {
    console.log(
      `[SNAPSHOT] Saved ${shapes.length} shapes for room: ${room.roomId}`
    );
  }
}
