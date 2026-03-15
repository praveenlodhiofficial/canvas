import Link from "next/link";

import { AccountNav } from "./AccountNav";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-8 md:flex-row">
      <aside className="border-border shrink-0 border-b pb-6 md:w-52 md:border-r md:border-b-0 md:pr-6 md:pb-0">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground mb-4 block text-sm font-medium transition-colors"
        >
          ← Back to rooms
        </Link>
        <AccountNav />
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
