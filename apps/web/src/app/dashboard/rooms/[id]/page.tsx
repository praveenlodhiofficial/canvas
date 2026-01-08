import { getRoomById } from "@/dal/room.dal";
import RoomCanvas from "@/components/RoomCanvas";
import { RoomType } from "@repo/shared/schema";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { getAllShapes } from "@/dal/shape.dal";
import { CanvasShape } from "@repo/shared/types";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = (await getRoomById(id)) as RoomType;

  if (!room) {
    toast.error("Room not found");
    redirect("/dashboard/rooms");
  }

  const shapes = await getAllShapes(room.id!);

  if (!shapes) {
    toast.error("Shapes not found");
    return;
  }

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <h1 className="text-2xl font-semibold mb-3">Room {room.name}</h1>
      <div className="border border-muted-foreground overflow-hidden w-[62rem] aspect-video mx-auto rounded-2xl flex justify-center items-center">
        {/* <RoomCanvas roomId={room.id!} /> */}
        <RoomCanvas
          initialShapes={shapes as unknown as CanvasShape[]}
          roomId={room.id!}
        />
      </div>

      <div className="flex flex-col gap-2">
        {shapes.map((shape) => (
          <div key={shape.id}>{JSON.stringify(shape)}</div>
        ))}
      </div>
    </div>
  );
}
