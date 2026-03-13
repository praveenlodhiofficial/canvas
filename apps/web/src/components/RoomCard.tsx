'use client'

import { MoreVertical, Users, Lock, Globe, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface RoomCardProps {
  id: string
  name: string
  description: string
  members: number
  maxMembers: number
  isPrivate: boolean
  lastModified: string
  members_preview: Array<{ initials: string; color: string }>
  onOpen?: () => void
  onDelete?: () => void
}

export function RoomCard({
  name,
  description,
  members,
  maxMembers,
  isPrivate,
  lastModified,
  members_preview,
  onOpen,
  onDelete,
}: RoomCardProps) {
  return (
    <Card className="group relative flex flex-col overflow-hidden border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative flex flex-col h-full p-6">
        {/* Header with title and menu */}
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
              <DropdownMenuItem onClick={onOpen} className="cursor-pointer">
                Open Room
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Share
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="space-y-4 pt-4 border-t border-border">
          {/* Members */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {members_preview.length > 0 ? (
                <div className="flex -space-x-2">
                  {members_preview.slice(0, 3).map((member, idx) => (
                    <Avatar key={idx} className="size-6 border-2 border-card">
                      <AvatarFallback className="text-xs bg-primary/20 text-primary">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {members_preview.length > 3 && (
                    <Avatar className="size-6 border-2 border-card">
                      <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                        +{members_preview.length - 3}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">No members</span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {members}/{maxMembers}
            </span>
          </div>

          {/* Meta info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPrivate ? (
                <Lock className="size-4 text-muted-foreground" />
              ) : (
                <Globe className="size-4 text-muted-foreground" />
              )}
              <span className="text-xs text-muted-foreground">
                {isPrivate ? 'Private' : 'Public'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{lastModified}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
