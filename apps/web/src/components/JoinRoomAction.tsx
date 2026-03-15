"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { LogIn } from "lucide-react";
import { toast } from "sonner";

import { joinRoomAction } from "@/domains/room/room.actions";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

export function JoinRoomAction() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  async function onJoinRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!roomId.trim()) {
      toast.error("Please enter a room ID");
      return;
    }

    try {
      setLoading(true);

      const result = await joinRoomAction({ id: roomId.trim() });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setIsOpen(false);
      setRoomId("");
      router.refresh();
      window.open(`/dashboard/rooms/${result.roomId}`, "_blank");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="border-border gap-2">
          <LogIn className="size-5" />
          Join Room
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Join a Room</DialogTitle>
          <DialogDescription>
            Enter the room ID or paste a shared room link to join
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onJoinRoom} className="space-y-6">
          <div className="py-2">
            <Input
              placeholder="Room ID"
              className="h-12 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              disabled={loading}
            />
          </div>
          <DialogFooter className="border-border grid grid-cols-2 justify-end gap-3">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setRoomId("");
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? "Joining..." : "Join"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
