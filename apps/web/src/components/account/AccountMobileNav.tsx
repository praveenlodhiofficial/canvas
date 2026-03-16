"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LockIcon, Menu, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard/account", label: "Account", icon: User },
  { href: "/dashboard/account/security", label: "Security", icon: LockIcon },
];

export function AccountMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const closeSheet = () => setOpen(false);

  return (
    <div className="w-fit">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 rounded-md"
            aria-label="Open account menu"
          >
            <Menu className="size-5" />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="fixed top-23 right-4 left-auto w-[min(calc(100vw-2rem),16rem)] translate-x-0 translate-y-0 rounded-lg border p-3 shadow-lg"
          showCloseButton={true}
        >
          <DialogTitle className="sr-only">Account</DialogTitle>
          <p className="text-muted-foreground px-2 py-1 text-xs font-medium tracking-wider uppercase">
            Account
          </p>
          <nav className="flex flex-col gap-0.5">
            {nav.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === "/dashboard/account"
                  ? pathname === href
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeSheet}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </DialogContent>
      </Dialog>
    </div>
  );
}
