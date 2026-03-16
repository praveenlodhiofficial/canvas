"use client";

import { useEffect, useState } from "react";

import { useTheme } from "next-themes";
import Link from "next/link";

import { Bell, Moon, Pencil, Search, Sun, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="border-border bg-card/80 sticky top-0 border-b backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link href="/dashboard" className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-105">
              <Pencil className="h-4 w-4" />
            </div>
            <span className="text-foreground text-2xl font-semibold">
              Canvas
            </span>
          </div>
        </Link>

        <div className="mx-8 max-w-md flex-1">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search rooms..."
              className="bg-muted border-border placeholder:text-muted-foreground pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Bell className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="bg-primary/10 text-primary hover:bg-primary/20 size-8 rounded-full"
          >
            <Link href="/dashboard/account">
              <User className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
