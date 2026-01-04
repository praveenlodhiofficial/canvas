"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MoreVertical, Pencil, TrashIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { config } from "@/lib/config"
import { useRouter } from "next/navigation"

export default function RoomActions({ roomId }: { roomId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch(`${config.backendUrl}/api/v1/rooms/${roomId}`, {
        method: "DELETE",
        credentials: "include",
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Failed to delete room")
        return
      }

      toast.success(data.message)
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete room")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* -------- 3 DOT MENU -------- */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="sketch-border" size="icon" onClick={(e) => e.stopPropagation()}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          side="right"
          sideOffset={5}
          className="w-48 gap-2 p-2 sketch-border bg-background/95 backdrop-blur-md"
        >
          <DropdownMenuItem className="cursor-pointer focus:bg-brand/10 focus:text-brand">
            <Pencil className="size-3.5 mr-2" />
            <span className="text-sm font-medium">Rename Room</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
            onClick={() => setOpen(true)}
          >
            <TrashIcon className="size-3.5 mr-2" />
            <span className="text-sm font-medium">Delete Room</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* -------- DELETE DIALOG -------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sketch-border bg-background/95 backdrop-blur-xl max-w-md border-brand/20">
          <DialogHeader className="gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive sketch-border border-destructive/20 mb-2">
              <TrashIcon className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight">Delete Room</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to delete this room? This action cannot be undone. All drawings and history within
              this room will be permanently removed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 gap-3">
            <Button
              variant="outline"
              className="sketch-border bg-transparent"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              className="sketch-border shadow-lg shadow-destructive/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
