import { CreateRoomModal } from "@/components/modal/room.modal";
import { getAllRooms } from "@/dal/room.dal";
import Link from "next/link";
import { MoveRight } from "lucide-react";

export default async function RoomPage() {
  const rooms = await getAllRooms();

  if (!rooms) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="sketch-border bg-background p-8 text-center">
          <p className="text-muted-foreground">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full h-[200vh]">
      {/* Create Room Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          My <span className="text-brand">Canvas</span> Rooms
        </h1>
        <p className="text-md text-muted-foreground">
          Create a new room or jump back into your existing collaborative
          sketches.
        </p>
      </div>

      {/* Rooms Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        <CreateRoomModal />

        {rooms.map((room) => (
          <Link
            href={`/dashboard/room/${room.id}`}
            target="_blank"
            rel="noopener noreferrer"
            key={room.id}
            className="group relative flex flex-col items-center justify-center gap-4 h-70 w-54 sketch-border bg-background transition-all hover:bg-brand/5 hover:-translate-y-1"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
              <span className="text-xl font-bold">
                {room.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground group-hover:text-brand transition-colors">
                {room.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Click to open canvas
              </p>
            </div>
            <MoveRight className="absolute bottom-4 right-4 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 text-brand" />
          </Link>
        ))}
      </div>
    </div>
  );
}
