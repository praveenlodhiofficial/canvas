import { getRoomById } from "@/dal/room.dal";
import RoomCanvas from "@/components/RoomCanvas";
import { RoomType } from "@repo/shared/schema";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = (await getRoomById(id)) as RoomType;

  if (!room) {
    return (
      <div>
        <h1>Room not found</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <h1 className="text-2xl font-semibold mb-3">Room {room.name}</h1>
      <div className="border border-muted-foreground overflow-hidden w-3xl aspect-video mx-auto rounded-2xl flex justify-center items-center">
        {/* <RoomCanvas roomId={room.id!} /> */}
        <RoomCanvas />
      </div>
    </div>
  );
}
