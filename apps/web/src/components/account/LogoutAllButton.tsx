"use client";

import { startTransition } from "react";

import { useRouter } from "next/navigation";

import { LogOut } from "lucide-react";

import { logoutUserAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";

export function LogoutAllButton() {
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      const res = await logoutUserAction();
      if (res.success) {
        router.refresh();
        router.push("/sign-in");
      }
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleLogout}
      className="gap-2"
    >
      <LogOut className="size-4" />
      Log out from this device
    </Button>
  );
}
