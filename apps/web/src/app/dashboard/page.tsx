export default async function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-lg text-muted-foreground">Protected route</p>
    </div>
  );
}
