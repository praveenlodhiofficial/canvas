import Link from "next/link";

import { getAccountUserAction } from "@/actions/account.actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMemberRoomsAction } from "@/domains/room/room.actions";
import { timeAgo } from "@/lib/time";

export default async function AccountActivityPage() {
  const [userResult, roomsResult] = await Promise.all([
    getAccountUserAction(),
    getMemberRoomsAction(),
  ]);

  if (!userResult.success || !userResult.user) {
    return <div className="text-muted-foreground text-sm">Please sign in.</div>;
  }

  const user = userResult.user;
  const rooms = roomsResult.success ? (roomsResult.rooms ?? []) : [];
  const lastLogin = user.lastLoginAt ? timeAgo(user.lastLoginAt) : null;

  const createdRooms = rooms.filter((r) => r.isOwner);
  const joinedRooms = rooms.filter((r) => !r.isOwner);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Activity</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Rooms you created, rooms you joined, and recent sign-in
        </p>
      </div>

      {lastLogin && (
        <Card>
          <CardHeader>
            <CardTitle>Last login</CardTitle>
            <CardDescription>When you last signed in</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground text-sm">{lastLogin}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Rooms you created</CardTitle>
          <CardDescription>Rooms where you are the owner</CardDescription>
        </CardHeader>
        <CardContent>
          {createdRooms.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              You haven&apos;t created any rooms yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {createdRooms.map((room) => (
                <li key={room.id}>
                  <Link
                    href={`/dashboard/rooms/${room.id}`}
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    {room.name}
                  </Link>
                  <span className="text-muted-foreground ml-2 text-xs">
                    Updated {timeAgo(room.updatedAt ?? new Date())}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rooms you joined</CardTitle>
          <CardDescription>Rooms you were invited to or joined</CardDescription>
        </CardHeader>
        <CardContent>
          {joinedRooms.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              You haven&apos;t joined any other rooms yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {joinedRooms.map((room) => (
                <li key={room.id}>
                  <Link
                    href={`/dashboard/rooms/${room.id}`}
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    {room.name}
                  </Link>
                  <span className="text-muted-foreground ml-2 text-xs">
                    Updated {timeAgo(room.updatedAt ?? new Date())}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
