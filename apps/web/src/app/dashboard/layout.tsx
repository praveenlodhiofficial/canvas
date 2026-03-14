import { redirect } from "next/navigation";

import { getCurrentUserAction } from "@/actions/user.actions";

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

  return <div>{children}</div>;
}
