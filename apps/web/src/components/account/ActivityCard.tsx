import Link from "next/link";

import type { AccountUser } from "@/actions/account.actions";
import { getMemberRoomsAction } from "@/domains/room/room.actions";
import { timeAgo } from "@/lib/time";

export async function ActivityCard({ user }: { user: AccountUser }) {
  const roomsResult = await getMemberRoomsAction();
  const rooms = roomsResult.success ? (roomsResult.rooms ?? []) : [];
  const lastLogin = user.lastLoginAt ? timeAgo(user.lastLoginAt) : null;
  const recentRooms = rooms.slice(0, 5);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
          Activity
        </h2>
        <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
          Last login and recent rooms
        </p>
      </div>
      <div className="space-y-3">
        {lastLogin && (
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Last login: {lastLogin}
          </p>
        )}
        {recentRooms.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No rooms yet
          </p>
        ) : (
          <ul className="space-y-1.5">
            {recentRooms.map((room) => (
              <li key={room.id}>
                <Link
                  href={`/dashboard/rooms/${room.id}`}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  {room.name}
                </Link>
                <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
                  {timeAgo(room.updatedAt ?? new Date())}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
