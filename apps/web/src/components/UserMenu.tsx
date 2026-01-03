import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser } from "@/dal/user.dal";
import { Button } from "./ui/button";
import { LogOutIcon, SettingsIcon } from "lucide-react";

export async function UserMenu() {
  const user = await getCurrentUser();

  return (
    <div className="right-9 top-20 sticky">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full flex items-center justify-center text-md sketch-border hover:bg-brand/10 hover:text-brand transition-colors border-2 bg-transparent"
          >
            {user.name
              .split(" ")
              .map((name: string) => name.charAt(0).toUpperCase())
              .join("")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-xs sketch-border border-2 bg-background/95 backdrop-blur-sm"
        >
          <DropdownMenuLabel className="flex items-center justify-start gap-3 p-3">
            <div className="w-10 h-10 bg-brand aspect-square text-white rounded-full flex items-center justify-center text-md font-bold sketch-border">
              {user.name
                .split(" ")
                .map((name: string) => name.charAt(0).toUpperCase())
                .join("")}
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
          <DropdownMenuItem className="flex items-center gap-3 cursor-pointer py-3 px-3 focus:bg-brand/10 focus:text-brand">
            <LogOutIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
