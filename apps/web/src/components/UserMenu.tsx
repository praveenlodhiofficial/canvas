import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { SettingsIcon } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import type { UserType } from "@repo/shared/schema";

export function UserMenu({ user }: { user: UserType }) {
  const initials = user.name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="right-9 top-20 sticky">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full flex items-center justify-center text-md sketch-border hover:bg-brand/10 hover:text-brand transition-colors border-2 bg-transparent"
          >
            {initials}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-xs sketch-border border-2 bg-background/95 backdrop-blur-sm"
        >
          <DropdownMenuLabel className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center text-md font-bold sketch-border">
              {initials}
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-muted" />

          <DropdownMenuItem className="flex items-center gap-3 cursor-pointer py-3 px-3 focus:bg-brand/10 focus:text-brand">
            <SettingsIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Manage Account</span>
          </DropdownMenuItem>

          <LogoutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
