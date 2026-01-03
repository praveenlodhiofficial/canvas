"use client";

import * as React from "react";
import Link from "next/link";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

export function Navbar() {
  const isMobile = useIsMobile();

  return (
    // center the navbar
    <NavigationMenu
      viewport={isMobile}
      className="sketch-border bg-transparent backdrop-blur-xs rounded-xl p-1 sticky top-5 z-10 mx-auto"
    >
      <NavigationMenuList className="flex-wrap gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="sketch-border hover:bg-brand/10 hover:text-brand transition-colors">
            Home
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] p-4">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full flex-col justify-end rounded-lg bg-linear-to-b from-brand/20 to-brand/5 p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6 sketch-border border-brand/20"
                    href="/"
                  >
                    <div className="mb-2 text-lg font-medium text-brand">
                      Canvas App
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Minimalistic drawing tool built for speed and creativity.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem
                href="/docs"
                title="Introduction"
                className="hover:bg-brand/5 rounded-md transition-colors"
              >
                Re-usable components built for the canvas experience.
              </ListItem>
              <ListItem
                href="/docs/installation"
                title="Installation"
                className="hover:bg-brand/5 rounded-md transition-colors"
              >
                Quick start guide to get your workspace ready.
              </ListItem>
              <ListItem
                href="/docs/primitives/typography"
                title="Typography"
                className="hover:bg-brand/5 rounded-md transition-colors"
              >
                Consistent text styles across the app.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="sketch-border hover:bg-brand/10 hover:text-brand transition-colors">
            Components
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px] p-4">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  className="hover:bg-brand/5 rounded-md transition-colors"
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={`${navigationMenuTriggerStyle()} sketch-border hover:bg-brand/10 hover:text-brand transition-colors`}
          >
            <Link href="/dashboard/rooms">Rooms</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger className="sketch-border hover:bg-brand/10 hover:text-brand transition-colors">
            With Icon
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-2 p-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="#"
                    className="flex flex-row items-center gap-2 p-2 rounded-md hover:bg-brand/5 text-sm transition-colors"
                  >
                    <CircleHelpIcon className="w-4 h-4 text-brand" />
                    Backlog
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="#"
                    className="flex flex-row items-center gap-2 p-2 rounded-md hover:bg-brand/5 text-sm transition-colors"
                  >
                    <CircleIcon className="w-4 h-4 text-brand" />
                    To Do
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="#"
                    className="flex flex-row items-center gap-2 p-2 rounded-md hover:bg-brand/5 text-sm transition-colors"
                  >
                    <CircleCheckIcon className="w-4 h-4 text-brand" />
                    Done
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li className={className} {...props}>
      <NavigationMenuLink asChild>
        <Link href={href} className="block p-3 space-y-1">
          <div className="text-sm leading-none font-medium text-brand/90">
            {title}
          </div>
          <p className="text-muted-foreground line-clamp-2 text-xs leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
