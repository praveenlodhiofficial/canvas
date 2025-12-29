import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Sign In Page</h1>
        <Button variant="outline">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
