import { authFetch } from "@/lib/auth/auth-fetch";
import { config } from "@/lib/config";
import { RoomMember } from "@repo/shared/schema";

export const findRoomMembers = async (roomId: string): Promise<RoomMember[]> => {
    const data = await authFetch<{
        message: string;
        members: RoomMember[];
    }>(`${config.backendUrl}/api/v1/room-members/${roomId}`, {
        method: "GET",
    });

    
    return data.members;
}