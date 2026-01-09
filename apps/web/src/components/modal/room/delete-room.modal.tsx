"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, ShareIcon, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { config } from "@/lib/config";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { RoomSchema, RoomType } from "@repo/shared/schema";

export default function RoomActions({ room }: { room: RoomType }) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(RoomSchema),
    defaultValues: {
      name: room.name,
    },
  });

  async function handleDelete(room: Pick<RoomType, "id">) {
    setLoading(true);
    try {
      const res = await fetch(`${config.backendUrl}/api/v1/rooms/${room.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete room");
        return;
      }

      toast.success(data.message);
      setOpenDeleteDialog(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete room");
    } finally {
      setLoading(false);
    }
  }

  async function handleRename(room: Pick<RoomType, "id" | "name">) {
    setLoading(true);

    try {
      const res = await fetch(
        `${config.backendUrl}/api/v1/rooms/${room.id}/rename`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(room),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result?.message || "Failed to rename room");
        return;
      }

      toast.success(result.message || "Room renamed successfully");
      setOpenRenameDialog(false);
      router.refresh();
    } catch (error) {
      console.error("[RENAME_ROOM_ERROR]", error);
      toast.error("Failed to rename room");
    } finally {
      setLoading(false);
    }
  }

  function handleShare(room: Pick<RoomType, "id">) {
    const shareLink = room.id;
    if (!shareLink) {
      toast.error("Room ID not found");
      return;
    }
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied to clipboard");
  }

  return (
    <>
      {/* -------- 3 DOT MENU -------- */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="group">
          {/* rotate border by 45 degrees on hover */}
          <Button
            variant="ghost"
            className="sketch-border transition-all hover:rotate-45"
            size="icon"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4 transition-all group-hover:-rotate-45" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          side="right"
          sideOffset={4}
          className="w-48 gap-2 p-2 sketch-border bg-transparent backdrop-blur-sm"
        >
          <DropdownMenuItem
            className="cursor-pointer focus:bg-brand/10 focus:text-brand"
            onClick={() => setOpenRenameDialog(true)}
          >
            <Pencil className="size-3.5 mr-1.5 focus:text-brand" />
            <span className="text-sm font-medium">Rename Room</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer focus:bg-destructive/10 focus:text-destructive"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <TrashIcon className="size-3.5 mr-1.5 focus:text-destructive" />
            <span className="text-sm font-medium focus:text-destructive">Delete Room</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer focus:bg-brand/10 focus:text-brand"
            onClick={() => handleShare(room)}
          >
            <ShareIcon className="size-3.5 mr-1.5 focus:text-brand" />
            <span className="text-sm font-medium">Share Room</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* -------- DELETE DIALOG -------- */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sketch-border bg-background/95 backdrop-blur-xl max-w-md border-brand/20">
          <DialogHeader className="gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive sketch-border border-destructive/20 mb-2">
              <TrashIcon className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight">
              Delete Room
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to delete this room? This action cannot be
              undone. All drawings and history within this room will be
              permanently removed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 gap-3">
            <Button
              variant="outline"
              className="sketch-border bg-transparent"
              onClick={() => setOpenDeleteDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              className="sketch-border shadow-lg shadow-destructive/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => handleDelete({ id: room.id! })}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* -------- RENAME DIALOG -------- */}
      <Dialog open={openRenameDialog} onOpenChange={setOpenRenameDialog}>
        <DialogContent className="sketch-border bg-background/95 backdrop-blur-xl max-w-md border-brand/20">
          <DialogHeader className="gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive sketch-border border-destructive/20 mb-2">
              <TrashIcon className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight">
              Rename Room
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              Enter the new name for the room.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                handleRename({ id: room.id!, name: data.name }),
              )}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm">
                      Room Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Design System Mockup"
                        className="h-12 sketch-border border-border font-medium focus-visible:ring-indigo-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-bold" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-14 text-lg sketch-border font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] bg-brand border-brand text-white"
              >
                Rename Room
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
