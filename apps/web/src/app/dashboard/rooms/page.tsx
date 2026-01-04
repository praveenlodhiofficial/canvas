import { CreateRoomModal } from "@/components/modal/room/create-room.modal";
import { getAllRooms } from "@/dal/room.dal";
import Link from "next/link";
import { RoomType } from "@repo/shared/schema";
import RoomActions from "@/components/modal/room/delete-room.modal";
import { MoveRight } from "lucide-react";
import { timeAgo } from "@/lib/time";

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
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">
          My <span className="text-brand">Canvas</span> Rooms
        </h1>
        <p className="text-muted-foreground">
          Create a new room or jump back into your existing sketches.
        </p>
      </div>
      {/* Rooms */}
      <div className="flex flex-wrap gap-10">
        <CreateRoomModal />
        {rooms.map((room: RoomType) => (
          <div
            key={room.id}
            className="relative flex flex-col gap-4 h-70 w-54 sketch-border bg-background transition-all hover:bg-brand/5 hover:-translate-y-1"
          >
            {/* 🔹 Three dots (TOP RIGHT) - with higher z-index */}
            <div className="absolute right-4 top-4 z-50 ">
              <RoomActions roomId={room.id as string} />
            </div>
            {/* 🔹 Card content */}
            <Link
              href={`/dashboard/rooms/${room.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-4 h-full"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <span className="text-xl font-bold">
                  {room.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-center">
                <p className="font-semibold group-hover:text-brand">
                  {room.name}
                </p>

                {/* updated at */}
                <p className="text-xs text-muted-foreground">
                  {timeAgo(room.updatedAt as Date)}
                </p>
              </div>

              <MoveRight className="absolute bottom-4 right-4 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 text-brand" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
