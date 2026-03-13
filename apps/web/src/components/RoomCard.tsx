'use client'

import { Card } from "./ui/card"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { GlobeIcon, Loader2, LockIcon, MoreVertical } from "lucide-react"
import { timeAgo } from "@/lib/time"
import { RoomDialog, RoomDeleteDialog } from "./RoomDialog"
import type { RoomMember } from "@repo/shared/schema"
import { toast } from "sonner"
import { useState } from "react"

interface RoomCardProps {
  id: string
  name: string
  description: string
  visibility: "PUBLIC" | "PRIVATE"
  updatedAt: Date
  members?: RoomMember[]
}

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return "?"
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    const first = parts[0]?.[0] ?? ""
    const last = parts[parts.length - 1]?.[0] ?? ""
    return (first + last).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
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
  }))

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
    <Card className="group relative flex flex-col overflow-hidden border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex flex-col h-full p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg line-clamp-1">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>

          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 -mr-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer" 
            onClick={onShareRoomLink}
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Share"}
              </DropdownMenuItem>
                <RoomDialog type="update" room={{
                  id,
                  name,
                  description,
                  visibility,
                }} />
              <DropdownMenuSeparator />
              <RoomDeleteDialog id={id} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1" />

        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {membersPreview.length > 0 ? (
                <div className="flex -space-x-2">
                  {membersPreview.slice(0, 3).map((member, idx) => (
                    <Avatar key={idx} className="size-6 border-2 border-card">
                      <AvatarFallback className="text-xs bg-primary/20 text-primary">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {membersPreview.length > 3 && (
                    <Avatar className="size-6 border-2 border-card">
                      <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                        +{membersPreview.length - 3}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">No members</span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {members.length} member{members.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {visibility === "PRIVATE" ? (
                <LockIcon className="size-4 text-muted-foreground" />
              ) : (
                <GlobeIcon className="size-4 text-muted-foreground" />
              )}
              <span className="text-xs text-muted-foreground">
                {visibility === "PRIVATE" ? "Private" : "Public"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {timeAgo(updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
