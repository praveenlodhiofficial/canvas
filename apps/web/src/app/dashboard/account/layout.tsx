import { AccountMobileNav } from "@/components/account/AccountMobileNav";
import { AccountNav } from "@/components/account/AccountNav";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 top-20 z-10 flex max-h-[calc(100vh-100px)] min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
      <div className="mx-auto flex w-full">
        <aside className="absolute top-5 right-5 z-30 md:hidden">
          <AccountMobileNav />
        </aside>
        <AccountNav />
        <main className="border-border hide-scrollbar min-h-0 min-w-0 flex-1 overflow-y-auto md:border-l">
          <div className="max-w-5xl space-y-8 px-4 py-6 md:px-6 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
