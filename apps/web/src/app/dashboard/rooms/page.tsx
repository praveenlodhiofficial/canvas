import {
    getAllRoomsAction,
} from "@/domains/room/room.actions";
import { RoomCard } from "@/components/RoomCard";
import { findRoomMembers } from "@/domains/roomMember/roomMember.dal";

export default async function RoomPage() {
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
        <div className="grid grid-cols-3 gap-4">
            {rooms.map((room, index) => (
                <div key={room.id}>
                    <RoomCard
                        id={room.id!}
                        name={room.name}
                        description={room.description!}
                        visibility={room.visibility}
                        updatedAt={room.updatedAt!}
                        members={roomMembers[index] ?? []}
                    />
                </div>
            ))}
        </div>
    );
}
