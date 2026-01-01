import { Navbar } from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-col gap-4 p-4">
      <div className="sticky top-5 z-10 gap-4 border p-4 rounded-full w-fit mx-auto">
            <Navbar />
        </div>
        {children}
    </div>;
}