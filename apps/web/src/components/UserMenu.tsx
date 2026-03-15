import Link from "next/link";

import { SettingsIcon } from "lucide-react";

import type { UserType } from "@repo/shared/schema";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogoutButton } from "./LogoutButton";
import { Button } from "./ui/button";

export function UserMenu({ user }: { user: UserType }) {
  const initials = user.name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="sticky top-20 right-9">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="text-md sketch-border hover:bg-brand/10 hover:text-brand flex h-10 w-10 items-center justify-center rounded-full border-2 bg-transparent transition-colors"
          >
            {initials}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="sketch-border bg-background/95 w-xs border-2 backdrop-blur-sm"
        >
          <DropdownMenuLabel className="flex items-center gap-3 p-3">
            <div className="bg-brand text-md sketch-border flex h-10 w-10 items-center justify-center rounded-full font-bold text-white">
              {initials}
            </div>
            <div className="flex flex-col">
              <p className="text-sm leading-none font-bold">{user.name}</p>
              <p className="text-muted-foreground mt-1 text-xs">{user.email}</p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-muted" />

          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/account"
              className="focus:bg-brand/10 focus:text-brand flex cursor-pointer items-center gap-3 px-3 py-3"
            >
              <SettingsIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Manage Account</span>
            </Link>
          </DropdownMenuItem>

          <LogoutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
