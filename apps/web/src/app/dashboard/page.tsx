import { getCurrentUser } from "@/dal/user.dal";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-lg text-muted-foreground">Protected route</p>
      <p className="text-lg text-muted-foreground">Welcome, {user.name}</p>
    </div>
  );
}
