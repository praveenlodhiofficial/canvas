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
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { RoomSchema, type RoomInput } from "@repo/shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoomAction } from "@/actions/room.actions";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function CreateRoomDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const form = useForm<Pick<RoomInput, "name" | "description" | "visibility">>({
    resolver: zodResolver(RoomSchema.pick({ name: true, description: true, visibility: true })),
    defaultValues: {
      name: "",
      description: "",
      visibility: "PRIVATE",
    },
  });

  async function onSubmit(data: Pick<RoomInput, "name" | "description" | "visibility">) {
    const response = await createRoomAction({ name: data.name, description: data.description, visibility: data.visibility });

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    const room = response.room;
    if (!room) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    setIsOpen(false);
    form.reset();
    window.open(`/dashboard/rooms/${room.id}`, "_blank");
    router.refresh();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="size-5" />
          Create Room
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] border-border">
 
      <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>
            Set up a new collaborative canvas room for your team
          </DialogDescription>
        </DialogHeader>
 
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="py-4 space-y-6">
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
                        className="h-12 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what this room is for..."
                        {...field}
                        className="h-12 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">
                      Visibility
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                          <RadioGroupItem value="PUBLIC" id="public" />
                          <Label htmlFor="PUBLIC" className="flex-1 cursor-pointer">
                            <div className="font-medium">Public</div>
                            <div className="text-sm text-muted-foreground">
                              Anyone in your workspace can access
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                          <RadioGroupItem value="PRIVATE" id="private" />
                          <Label htmlFor="PRIVATE" className="flex-1 cursor-pointer">
                            <div className="font-medium">Private</div>
                            <div className="text-sm text-muted-foreground">
                              Only invited members can access
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 justify-end border-border">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
