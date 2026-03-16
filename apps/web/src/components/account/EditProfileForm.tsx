"use client";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  type UpdateProfileInput,
  UpdateProfileSchema,
} from "@repo/shared/schema";

import type { AccountUser } from "@/actions/account.actions";
import { updateProfileAction } from "@/actions/account.actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function EditProfileForm({
  user,
  onSuccess,
  onCancel,
}: {
  user: AccountUser;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      username: user.username ?? "",
      avatarUrl: user.avatarUrl ?? "",
      bio: user.bio ?? "",
    },
  });

  async function onSubmit(data: UpdateProfileInput) {
    const payload = {
      name: data.name,
      username: data.username || null,
      avatarUrl: data.avatarUrl || null,
      bio: data.bio || null,
    };
    const result = await updateProfileAction(payload);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("Profile updated");
    router.refresh();
    onSuccess?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  className="border-border focus-visible:ring-ring/50 h-10 rounded-md focus-visible:ring-2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="username"
                  className="border-border focus-visible:ring-ring/50 h-10 rounded-md focus-visible:ring-2"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile picture URL (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://..."
                  type="url"
                  className="border-border focus-visible:ring-ring/50 h-10 rounded-md focus-visible:ring-2"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Short bio"
                  className="border-border focus-visible:ring-ring/50 h-10 rounded-md focus-visible:ring-2"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </Form>
  );
}
