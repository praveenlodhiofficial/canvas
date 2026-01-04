import { getRoomById } from "@/dal/room.dal";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = await getRoomById(id);

  if (!room) {
    return (
      <div>
        <h1>Room not found</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Room {room.name}</h1>
    </div>
  );
}
