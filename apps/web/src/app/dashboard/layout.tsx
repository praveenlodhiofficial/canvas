import { redirect } from "next/navigation";

import { getCurrentUserAction } from "@/actions/user.actions";
import { Header } from "@/components/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getCurrentUserAction();

  if (!result.success) {
    redirect("/sign-in");
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 p-6 md:p-8 lg:p-10">{children}</div>
    </div>
  );
}
