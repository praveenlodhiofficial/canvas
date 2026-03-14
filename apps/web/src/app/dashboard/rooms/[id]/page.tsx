import RoomCanvas from "@/components/RoomCanvas";
import { redirect } from "next/navigation";
import { CanvasShape } from "@repo/shared/types";
import { getRoomByIdAction } from "@/domains/room/room.actions";
import { getRoomShapesAction } from "@/actions/shape.actions";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const roomResult = await getRoomByIdAction({ id });

  if (!roomResult.success) {
    redirect("/dashboard/rooms");
  }

  const room = roomResult.room;
  const shapes = await getRoomShapesAction(room.id!);

  return (
    <div className=" flex flex-col w-full items-center justify-center">
      <div className="absolute inset-0 overflow-hidden w-full h-screen flex justify-center items-center">
        <RoomCanvas
          roomName={room.name!}
          roomId={room.id!}
          initialShapes={shapes as unknown as CanvasShape[]}
          totalMembers={room.totalMembers}
        />
      </div>
    </div>
  );
}
