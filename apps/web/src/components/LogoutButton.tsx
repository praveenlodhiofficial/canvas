"use client";

import { startTransition } from "react";

import { useRouter } from "next/navigation";

import { LogOutIcon } from "lucide-react";

import { logoutUserAction } from "@/actions/auth.actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

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
      className="focus:bg-destructive/10 focus:text-destructive flex cursor-pointer items-center gap-3 px-3 py-3"
    >
      <LogOutIcon className="h-4 w-4" />
      <span className="text-sm font-medium">Log Out</span>
    </DropdownMenuItem>
  );
}
