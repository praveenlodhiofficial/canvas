import { Header } from "@/components/Header";
import { RoomCard } from "@/components/RoomCard";
import { RoomDialog } from "@/components/RoomDialog";
import { Empty } from "@/components/ui/empty";
import { getAllRoomsAction } from "@/domains/room/room.actions";
import { findRoomMembers } from "@/domains/roomMember/roomMember.dal";

export default async function RoomsDashboard() {
  const res = await getAllRoomsAction();
  if (!res.success) {
    return <div>Error: {res.message}</div>;
  }
  const rooms = res.rooms;

  if (!rooms) {
    return <div>No rooms found</div>;
  }

  const roomMembers = await Promise.all(
    rooms.map(async (room) => {
      try {
        return await findRoomMembers(room.id!);
      } catch {
        return [];
      }
    })
  );

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-foreground text-3xl font-bold md:text-4xl">
                Workspace Rooms
              </h1>
              <p className="text-muted-foreground mt-2">
                Create and manage collaborative canvas rooms for your team
              </p>
            </div>
            <RoomDialog type="create" />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-muted-foreground text-sm">
              {rooms.length} room{rooms.length !== 1 ? "s" : ""}
            </div>
          </div>

          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room, index) => (
                <RoomCard
                  key={room.id!}
                  id={room.id!}
                  name={room.name}
                  description={room.description!}
                  visibility={room.visibility}
                  updatedAt={room.updatedAt!}
                  members={roomMembers[index] ?? []}
                />
              ))}
            </div>
          ) : (
            <Empty title="No rooms found" />
          )}
        </div>
      </main>
    </div>
  );
}
