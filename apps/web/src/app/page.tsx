import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      
      <div className="absolute top-5 right-5 flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/sign-up">Sign Up</Link>
        </Button>
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Landing Page</h1>
      <p className="text-lg text-muted-foreground">Public route</p>
      <p>Backend URL: {config.backendUrl}</p>
    </div>
    </div>
  );
}
