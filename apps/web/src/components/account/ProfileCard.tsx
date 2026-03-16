"use client";

import { useState } from "react";

import { Pencil } from "lucide-react";

import type { AccountUser } from "@/actions/account.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { EditProfileForm } from "./EditProfileForm";

export function ProfileCard({ user }: { user: AccountUser }) {
  const [editing, setEditing] = useState(false);

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const initials = user.name
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
            Profile
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setEditing(false)}
          >
            Cancel
          </Button>
        </div>
        <EditProfileForm
          user={user}
          onSuccess={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
            Profile
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
            Your account information
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={() => setEditing(true)}
        >
          <Pencil className="size-3.5" />
          Edit
        </Button>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <Avatar className="size-14 shrink-0">
          <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
          <AvatarFallback className="text-sm">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 space-y-1">
          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
            {user.name}
          </p>
          {user.username && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              @{user.username}
            </p>
          )}
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {user.email}
          </p>
          {joinedDate && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Joined {joinedDate}
            </p>
          )}
          {user.bio && (
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              {user.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
