"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusIcon, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { RoomSchema, type RoomType } from "@repo/shared/schema";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { config } from "@/lib/config";
import { useState } from "react";

export function CreateRoomModal() {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<RoomType>({
    resolver: zodResolver(RoomSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: RoomType) {
    const response = await fetch(`${config.backendUrl}/api/v1/create-room`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message);
      return;
    }

    const responseData = await response.json();
    toast.success("Room created successfully");
    setIsOpen(false);
    form.reset();
    window.open(`/dashboard/rooms/${responseData.room.id}`, "_blank");
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="group flex flex-col items-center justify-center gap-4 h-70 w-54 sketch-border bg-brand/5 border-dashed transition-all hover:bg-brand/10 hover:-translate-y-1">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/20 text-brand transition-transform group-hover:scale-110">
            <PlusIcon className="h-8 w-8" strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <p className="font-bold text-brand uppercase tracking-wider text-sm">
              Create New Room
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Start a fresh sketch
            </p>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md sketch-border bg-background p-0 overflow-hidden border-none shadow-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6 bg-brand/5 border-b border-brand/10">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-brand/20 rounded-lg">
                    <Sparkles className="h-5 w-5 text-brand" />
                  </div>
                  <DialogTitle className="text-2xl font-bold text-foreground">
                    New Canvas
                  </DialogTitle>
                </div>
                <DialogDescription className="text-muted-foreground">
                  Give your room a name to start collaborating in real-time.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">
                      Room Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Design System Mockup"
                        {...field}
                        className="sketch-border focus:ring-brand focus:border-brand h-12 text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="p-6 bg-muted/50 flex justify-end gap-3">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="sketch-border bg-transparent"
                  onClick={() => form.reset()}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                className="bg-brand hover:bg-brand/90 text-white font-bold px-8 sketch-border border-none"
              >
                Create Room
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
