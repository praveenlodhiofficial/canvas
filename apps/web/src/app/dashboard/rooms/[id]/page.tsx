import RoomCanvas from "@/components/RoomCanvas";
import { redirect } from "next/navigation";
import { CanvasShape } from "@repo/shared/types";
import { getRoomByIdAction } from "@/actions/room.actions";
import { getRoomShapesAction } from "@/actions/shape.actions";
import Link from "next/link";

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
      <div className="z-50 pointer-events-auto bg-white shadow-xl sketch-border border h-14 flex justify-between items-center top-3 left-[7.5%] translate-x-[-50%] absolute border-red-500">
        <div className="pointer-events-auto flex justify-between items-center bg-muted-foreground/15 px-5 w-full h-full">
          <Link
            href="/dashboard/rooms"
            className="text-muted-foreground text-md font-medium cursor-pointer"
          >
            Rooms
          </Link>
          <span>&nbsp;/&nbsp;</span>
          <span className="text-md font-medium capitalize">{room.name}</span>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden bg-white w-full h-screen flex justify-center items-center">
        <RoomCanvas
          roomId={room.id!}
          initialShapes={shapes as unknown as CanvasShape[]}
        />
      </div>
    </div>
  );
}
