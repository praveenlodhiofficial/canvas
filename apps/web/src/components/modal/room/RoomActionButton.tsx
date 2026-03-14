"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { MoreVertical, Pencil, ShareIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

import type { Room, RoomInput } from "@repo/shared/schema";
import { RoomSchema } from "@repo/shared/schema";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  deleteRoomAction,
  renameRoomAction,
  shareRoomAction,
} from "@/domains/room/room.actions";

export default function RoomActionButton({ room }: { room: Room }) {
  const router = useRouter();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------------- RENAME FORM ---------------- */

  const form = useForm<Pick<RoomInput, "name">>({
    resolver: zodResolver(RoomSchema.pick({ name: true })),
    defaultValues: {
      name: room.name,
    },
  });

  /* ---------------- ACTION HANDLERS ---------------- */

  async function onConfirmDeleteRoom() {
    try {
      setLoading(true);

      const result = await deleteRoomAction({ id: room.id });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setOpenDeleteDialog(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function onSubmitRenameRoom(data: Pick<RoomInput, "id" | "name">) {
    try {
      setLoading(true);

      const result = await renameRoomAction({
        id: room.id,
        name: data.name,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setOpenRenameDialog(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function onShareRoomLink() {
    const result = await shareRoomAction({ id: room.id });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    navigator.clipboard.writeText(room.id!);
    toast.success(`${result.message} - ${room.id}`);
  }

  return (
    <>
      {/* -------- 3 DOT MENU -------- */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="group">
          <Button
            variant="ghost"
            size="icon"
            className="sketch-border transition-all hover:rotate-45"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <MoreVertical className="top-50% left-50% absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 transition-all group-hover:rotate-90" />
              <MoreVertical className="top-50% left-50% absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 transition-all" />
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          side="right"
          sideOffset={4}
          className="sketch-border w-48 bg-transparent p-2 backdrop-blur-sm"
        >
          <DropdownMenuItem
            className="focus:bg-brand/10 focus:text-brand cursor-pointer"
            onClick={() => setOpenRenameDialog(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Rename Room
          </DropdownMenuItem>

          <DropdownMenuItem
            className="focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete Room
          </DropdownMenuItem>

          <DropdownMenuItem
            className="focus:bg-brand/10 focus:text-brand cursor-pointer"
            onClick={onShareRoomLink}
          >
            <ShareIcon className="mr-2 h-4 w-4" />
            Share Room
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* -------- DELETE DIALOG -------- */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sketch-border bg-background/95 max-w-md backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Delete Room</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All drawings in this room will be
              permanently removed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              disabled={loading}
              onClick={onConfirmDeleteRoom}
            >
              {loading ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* -------- RENAME DIALOG -------- */}
      <Dialog open={openRenameDialog} onOpenChange={setOpenRenameDialog}>
        <DialogContent className="sketch-border bg-background/95 max-w-md backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Rename Room</DialogTitle>
            <DialogDescription>
              Enter a new name for this room.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitRenameRoom)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Design System Mockup"
                        className="sketch-border h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="bg-brand h-12 w-full font-bold text-white"
                disabled={loading}
              >
                {loading ? "Renaming..." : "Rename Room"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
