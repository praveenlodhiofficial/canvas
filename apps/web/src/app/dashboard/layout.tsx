import { Navbar } from "@/components/Navbar";
import { UserMenu } from "@/components/UserMenu";
import { getCurrentUser } from "@/dal/user.dal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // prefetch the current user
  await getCurrentUser();

  return (
    <div className="flex flex-col gap-10 py-5 px-12">
      <div className="sticky top-5 z-10 flex justify-between items-center">
        <Navbar />
        <UserMenu />
      </div>
      {children}
    </div>
  );
}
