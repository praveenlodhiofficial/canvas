import { redirect } from "next/navigation";

import { CanvasShape } from "@repo/shared/types";

import { getRoomShapesAction } from "@/actions/shape.actions";
import { getCurrentUserAction } from "@/actions/user.actions";
import RoomCanvas from "@/components/RoomCanvas";
import { getRoomByIdAction } from "@/domains/room/room.actions";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [roomResult, userResult] = await Promise.all([
    getRoomByIdAction({ id }),
    getCurrentUserAction(),
  ]);

  if (!roomResult.success) {
    redirect("/dashboard/rooms");
  }

  const room = roomResult.room;
  const shapes = await getRoomShapesAction(room.id!);
  const currentUserId = userResult.success
    ? (userResult.user?.id ?? null)
    : null;

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="absolute inset-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <RoomCanvas
          roomName={room.name!}
          roomId={room.id!}
          initialShapes={shapes as unknown as CanvasShape[]}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}
