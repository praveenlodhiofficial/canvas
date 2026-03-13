"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { joinRoomAction } from "@/domains/room/room.actions";

export function JoinRoomAction() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  async function onJoinRoom() {
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
      window.open(`/dashboard/rooms/${result.roomId}`, "_blank");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Enter room ID"
        className="sketch-border"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        disabled={loading}
      />

      <Button
        variant="default"
        className="sketch-border"
        onClick={onJoinRoom}
        disabled={loading}
      >
        {loading ? "Joining..." : "Join Room"}
      </Button>
    </div>
  );
}
