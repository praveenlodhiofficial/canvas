"use client";

import { LogOutIcon } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { logoutUserAction } from "@/actions/auth.actions";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logging out...");
    startTransition(async () => {
      const res = await logoutUserAction();

      if (res.success) {
        router.refresh();
        router.push("/sign-in");
      }
    });
  };

  return (
    <DropdownMenuItem
      onClick={handleLogout}
      variant="destructive"
      className="flex items-center gap-3 cursor-pointer py-3 px-3 focus:bg-destructive/10 focus:text-destructive"
    >
      <LogOutIcon className="w-4 h-4" />
      <span className="text-sm font-medium">Log Out</span>
    </DropdownMenuItem>
  );
}
