"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { type RoomInput, RoomSchema } from "@repo/shared/schema";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  createRoomAction,
  deleteRoomAction,
  updateRoomAction,
} from "@/domains/room/room.actions";

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
    resolver: zodResolver(
      RoomSchema.pick({ name: true, description: true, visibility: true })
    ),
    defaultValues: {
      name: room.name ?? "",
      description: room.description ?? "",
      visibility: room.visibility ?? "PRIVATE",
    },
  });

  async function onSubmit(
    data: Pick<RoomInput, "name" | "description" | "visibility">
  ) {
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
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Plus className="size-5" />
            Create Room
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/90 h-fit w-full cursor-pointer justify-start px-2 py-1.5"
          >
            Edit Room
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="border-border max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {!isUpdate ? "Create New Room" : "Edit Room"}
          </DialogTitle>
          <DialogDescription>
            {!isUpdate
              ? "Set up a new collaborative canvas room for your team"
              : "Update your room details"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6 py-4">
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
                        <div className="border-border hover:bg-muted/50 flex cursor-pointer items-center space-x-2 rounded-lg border p-3">
                          <RadioGroupItem value="PUBLIC" id="public" />
                          <Label
                            htmlFor="PUBLIC"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium">Public</div>
                            <div className="text-muted-foreground text-sm">
                              Anyone in your workspace can access
                            </div>
                          </Label>
                        </div>
                        <div className="border-border hover:bg-muted/50 flex cursor-pointer items-center space-x-2 rounded-lg border p-3">
                          <RadioGroupItem value="PRIVATE" id="private" />
                          <Label
                            htmlFor="PRIVATE"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium">Private</div>
                            <div className="text-muted-foreground text-sm">
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

            <div className="border-border grid grid-cols-2 justify-end gap-3">
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
        <Button
          variant="destructive"
          className="bg-destructive hover:bg-destructive/90 hover:text-destructive-foreground/90 w-full justify-start text-red-50"
          size="sm"
        >
          <Trash2 className="mr-2 size-4" />
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
        <DialogFooter className="border-border grid grid-cols-2 justify-end gap-3">
          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DialogClose>
          <Button variant="destructive" className="w-full" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
