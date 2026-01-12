import { Navbar } from "@/components/Navbar";
import { UserMenu } from "@/components/UserMenu";
import { getCurrentUserAction } from "@/actions/user.actions";
import { redirect } from "next/navigation";
import type { UserType } from "@repo/shared/schema";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getCurrentUserAction();

  // This is the only place where redirect happens
  if (!result.success) {
    redirect("/sign-in");
  }

  const user: UserType = result.user;

  return (
    <div className="flex flex-col gap-10 py-5 px-12">
      <div className="sticky top-5 z-5 flex justify-between items-center">
        <Navbar />
        <UserMenu user={user} />
      </div>

      <p className="text-sm text-muted-foreground">
        Welcome, <span className="font-semibold">{user.name}</span>
      </p>

      {children}
    </div>
  );
}
