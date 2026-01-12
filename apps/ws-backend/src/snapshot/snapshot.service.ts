import { prisma } from "@repo/database";
import { RoomState } from "../rooms/room.state";
import { CanvasShape } from "@repo/shared/types";
import { mapCanvasShapeToDbType } from "./shapeType.mapper";

export async function snapshotRoom(room: RoomState) {
  const shapes = Array.from(room.shapes.values());

  console.log(
    `[SNAPSHOT] Shapes to save: ${shapes.length} || room: ${room.roomId}`,
  );

  await prisma.$transaction([
    prisma.shape.deleteMany({
      where: { roomId: room.roomId },
    }),

    prisma.shape.createMany({
      data: shapes.map((shape: CanvasShape) => ({
        id: shape.id,
        type: mapCanvasShapeToDbType(shape),
        x: shape.x,
        y: shape.y,
        width: "width" in shape ? shape.width : null,
        height: "height" in shape ? shape.height : null,
        points: "points" in shape ? shape.points : undefined,
        roomId: room.roomId,
      })),
    }),
  ]);

  console.log(
    `[SNAPSHOT] Snapshot saved: ${shapes.length} shapes || room: ${room.roomId}`,
  );
}
