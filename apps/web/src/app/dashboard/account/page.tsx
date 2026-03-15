import { redirect } from "next/navigation";

import { getAccountUserAction } from "@/actions/account.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { timeAgo } from "@/lib/time";

export default async function AccountProfilePage() {
  const result = await getAccountUserAction();
  if (!result.success || !result.user) redirect("/sign-in");

  const user = result.user;
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const initials = user.name
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Your account information and workspace stats
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile information</CardTitle>
          <CardDescription>Name, email, and avatar</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <Avatar className="size-20 shrink-0">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-1">
            <p className="text-foreground font-semibold">{user.name}</p>
            {user.username && (
              <p className="text-muted-foreground text-sm">@{user.username}</p>
            )}
            <p className="text-muted-foreground text-sm">{user.email}</p>
            {joinedDate && (
              <p className="text-muted-foreground text-sm">
                Joined {joinedDate}
              </p>
            )}
            {user.bio && (
              <p className="text-muted-foreground mt-2 text-sm">{user.bio}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace stats</CardTitle>
          <CardDescription>Rooms you created and joined</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-6">
          <div>
            <p className="text-muted-foreground text-sm">Rooms created</p>
            <p className="text-foreground text-2xl font-semibold">
              {user.roomsCreatedCount ?? 0}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Rooms joined</p>
            <p className="text-foreground text-2xl font-semibold">
              {user.roomsJoinedCount ?? 0}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
