"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
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
import { createRoomAction, deleteRoomAction, updateRoomAction } from "@/domains/room/room.actions";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";


/* ============================================== ROOM DIALOG ============================================== */
type RoomDialogProps =
  | { type: "create" }
  | {
      type: "update";
      room: {
        id: string;
        name: string;
        description?: string | null;
        visibility: "PUBLIC" | "PRIVATE";
      };
    };

export function RoomDialog(props: RoomDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const isUpdate = props.type === "update";
  const room = isUpdate
    ? props.room
    : { id: "", name: "", description: "", visibility: "PRIVATE" as const };

  const form = useForm<Pick<RoomInput, "name" | "description" | "visibility">>({
    resolver: zodResolver(RoomSchema.pick({ name: true, description: true, visibility: true })),
    defaultValues: {
      name: room.name ?? "",
      description: room.description ?? "",
      visibility: room.visibility ?? "PRIVATE",
    },
  });

  async function onSubmit(data: Pick<RoomInput, "name" | "description" | "visibility">) {
    const response = isUpdate
      ? await updateRoomAction(room.id, data)
      : await createRoomAction(data);
  
    if (!response.success) {
      toast.error(response.message);
      return;
    }
  
    toast.success(response.message);
  
    setIsOpen(false);
    form.reset();
    router.refresh();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {!isUpdate ? (
          <Button
            size="lg"
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="size-5" />
            Create Room
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/90 cursor-pointer justify-start px-2 py-1.5 h-fit w-full"
          >
            Edit Room
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto border-border">
 
      <DialogHeader>
          <DialogTitle>{!isUpdate ? "Create New Room" : "Edit Room"}</DialogTitle>
          <DialogDescription>
            {!isUpdate ? "Set up a new collaborative canvas room for your team" : "Update your room details"}
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
                        className="min-h-30 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                {!isUpdate ? "Create Room" : "Update Room"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================== ROOM DELETE DIALOG ============================================== */
export function RoomDeleteDialog({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  async function onDelete() {
    const response = await deleteRoomAction({ id });
    if (!response.success) {
      toast.error(response.message);
      return;
    }
    toast.success(response.message);
    setIsOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full justify-start bg-destructive text-red-50 hover:bg-destructive/90 hover:text-destructive-foreground/90" size="sm">
          <Trash2 className="size-4 mr-2" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle>Delete Room</DialogTitle>
          <DialogDescription>
            This action cannot be undone. All drawings in this room will be
            permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2 gap-3 justify-end border-border">
          <DialogClose asChild>
            <Button variant="outline" className="w-full">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" className="w-full" onClick={onDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
