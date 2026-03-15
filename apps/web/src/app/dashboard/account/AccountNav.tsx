"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Activity,
  LayoutDashboard,
  LockIcon,
  Palette,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard/account", label: "Profile", icon: User },
  {
    href: "/dashboard/account/profile",
    label: "Edit profile",
    icon: LayoutDashboard,
  },
  { href: "/dashboard/account/security", label: "Security", icon: LockIcon },
  { href: "/dashboard/account/appearance", label: "Appearance", icon: Palette },
  { href: "/dashboard/account/activity", label: "Activity", icon: Activity },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      <p className="text-muted-foreground mb-2 px-3 text-xs font-medium tracking-wider uppercase">
        Account
      </p>
      {nav.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/dashboard/account"
            ? pathname === href
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
