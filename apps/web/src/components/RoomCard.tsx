"use client";

import { useState } from "react";

import Link from "next/link";

import { GlobeIcon, Loader2, LockIcon, MoreVertical } from "lucide-react";
import { toast } from "sonner";

import type { RoomMember } from "@repo/shared/schema";

import { timeAgo } from "@/lib/time";

import { RoomDeleteDialog, RoomDialog } from "./RoomDialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface RoomCardProps {
  id: string;
  name: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE";
  updatedAt: Date;
  members?: RoomMember[];
}

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    const first = parts[0]?.[0] ?? "";
    const last = parts[parts.length - 1]?.[0] ?? "";
    return (first + last).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function RoomCard({
  id,
  name,
  description,
  visibility,
  updatedAt,
  members = [],
}: RoomCardProps) {
  const membersPreview = members.map((m) => ({
    initials: getInitials(m.user?.name ?? undefined),
  }));

  const [loading, setLoading] = useState(false);

  async function onShareRoomLink() {
    try {
      setLoading(true);
      navigator.clipboard.writeText(id);
      toast.success(`Room link copied to clipboard`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to copy room link`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Link href={`/dashboard/rooms/${id}`} target="_blank">
      <Card className="group bg-card/50 hover:border-primary/30 relative flex cursor-pointer flex-col overflow-hidden border-none transition-all duration-300 hover:shadow-lg">
        <div className="from-primary/5 to-accent/5 absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex h-full flex-col p-6">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-foreground line-clamp-1 text-lg font-semibold">
                {name}
              </h3>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                {description}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground -mr-2 size-8 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={onShareRoomLink}
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Share"
                  )}
                </DropdownMenuItem>
                <RoomDialog
                  type="update"
                  room={{
                    id,
                    name,
                    description,
                    visibility,
                  }}
                />
                <DropdownMenuSeparator />
                <RoomDeleteDialog id={id} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex-1" />

          <div className="border-border space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {membersPreview.length > 0 ? (
                  <div className="flex -space-x-2">
                    {membersPreview.slice(0, 3).map((member, idx) => (
                      <Avatar key={idx} className="border-card size-6 border-2">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {membersPreview.length > 3 && (
                      <Avatar className="border-card size-6 border-2">
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                          +{membersPreview.length - 3}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    No members
                  </span>
                )}
              </div>
              <span className="text-muted-foreground text-sm">
                {members.length} member{members.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {visibility === "PRIVATE" ? (
                  <LockIcon className="text-muted-foreground size-4" />
                ) : (
                  <GlobeIcon className="text-muted-foreground size-4" />
                )}
                <span className="text-muted-foreground text-xs">
                  {visibility === "PRIVATE" ? "Private" : "Public"}
                </span>
              </div>
              <span className="text-muted-foreground text-xs">
                {timeAgo(updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
