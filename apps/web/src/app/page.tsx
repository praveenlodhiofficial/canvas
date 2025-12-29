import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex gap-4">
        <Button variant="outline">Sign Up</Button>
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
