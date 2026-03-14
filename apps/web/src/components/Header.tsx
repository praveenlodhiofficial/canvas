"use client";

import { useEffect, useState } from "react";

import { useTheme } from "next-themes";

import { Bell, Moon, Search, Sun, User } from "lucide-react";

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
    <header className="border-border bg-card/80 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-primary size-8 rounded-lg" />
            <span className="text-foreground font-semibold">Canvas</span>
          </div>
        </div>

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
            className="bg-primary/10 text-primary hover:bg-primary/20 size-8 rounded-full"
          >
            <User className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
