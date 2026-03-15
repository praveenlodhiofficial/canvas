"use client";

import { useState } from "react";

import Link from "next/link";

import { GlobeIcon, Loader2, LockIcon, MoreVertical } from "lucide-react";
import { toast } from "sonner";

import type { RoomMember } from "@repo/shared/schema";

import { RoomDeleteDialog, RoomDialog } from "./RoomDialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
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
  /** True if the current user created this room; false if they joined it */
  isOwner?: boolean;
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
  members = [],
  isOwner = true,
}: RoomCardProps) {
  const membersPreview = members.map((m) => ({
    initials: getInitials(m.user?.name ?? undefined),
  }));

  const [loading, setLoading] = useState(false);

  async function onShareRoomLink(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
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
    <Link
      href={`/dashboard/rooms/${id}`}
      target="_blank"
      className="block h-full"
    >
      <Card
        className={
          isOwner
            ? "group border-border/80 bg-card/50 relative flex h-full min-h-0 cursor-pointer flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-900/50 hover:shadow-lg"
            : "group border-muted-foreground/25 bg-muted/20 relative flex h-full min-h-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-dashed transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-900/50 hover:shadow-lg"
        }
      >
        <div
          className={
            isOwner
              ? "from-primary/5 to-accent/5 absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              : "from-primary/5 to-accent/5 absolute inset-0 bg-linear-to-br opacity-[0.03] transition-opacity duration-300 group-hover:opacity-100"
          }
        />

        <div className="relative flex min-h-0 flex-1 flex-col p-5">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <Badge
                  className={`shrink-0 border-0 text-[10px] font-medium tracking-wide uppercase ${
                    isOwner
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-sky-500/10 text-sky-500"
                  }`}
                >
                  {isOwner ? "Created" : "Joined"}
                </Badge>
              </div>
              <h3 className="text-foreground line-clamp-1 text-base font-semibold">
                {name}
              </h3>
              <p className="mt-0.5 line-clamp-2 text-sm text-neutral-400">
                {description}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground -mr-2 size-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
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
                {isOwner && (
                  <>
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
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex min-h-0 flex-1" />

          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between gap-2">
              {membersPreview.length > 0 ? (
                <div className="flex shrink-0 -space-x-2">
                  {membersPreview.slice(0, 3).map((member, idx) => (
                    <Avatar key={idx} className="border-card size-7 border-2">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {membersPreview.length > 3 && (
                    <Avatar className="border-card size-7 border-2">
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
              {visibility === "PRIVATE" ? (
                <span className="flex items-center gap-1.5 text-sm text-neutral-300">
                  <LockIcon className="size-3.5 shrink-0" />
                  Private
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm text-neutral-300">
                  <GlobeIcon className="size-3.5 shrink-0" />
                  Public
                </span>
              )}
            </div>
            {/* <div className="text-muted-foreground  text-sm">
              {members.length} member{members.length !== 1 ? "s" : ""}
              <span className="text-muted-foreground/80"> · </span>
              {timeAgo(updatedAt)}
            </div> */}
          </div>
        </div>
      </Card>
    </Link>
  );
}
