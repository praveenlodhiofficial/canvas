"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LockIcon, User } from "lucide-react";

import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard/account", label: "Account", icon: User },
  { href: "/dashboard/account/security", label: "Security", icon: LockIcon },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden w-[25vw] flex-col items-end gap-1 px-5 md:flex">
      <div className="w-48">
        <p className="mt-5 mb-2 px-3 text-xs tracking-wider text-neutral-500 uppercase">
          Account
        </p>
        <div className="flex flex-col gap-1">
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
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                    : "text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
