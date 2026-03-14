"use client";

import { Button } from "@/components/ui/button";
import { SignUpInput, SignUpSchema } from "@repo/shared/schema";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Github, Mail } from "lucide-react";
import { useState } from "react";
import { config } from "@/lib/config";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignUpInput) {
    const response = await fetch(`${config.backendUrl}/api/v1/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      toast.error(result.message);
      return;
    }

    toast.success("User signed up successfully");
    router.push("/sign-in");
  }

  return (
    <AuthPageShell
      title="Create an account"
      subtitle="Start sketching your best ideas today."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in">
            <Button variant="link" className="px-0 h-auto font-medium text-primary">
              Log in here
            </Button>
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    className="h-11 bg-background border-border"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    className="h-11 bg-background border-border"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-11 bg-background border-border pr-10"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 px-0 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full h-11 font-medium">
            Sign Up
          </Button>
        </form>
      </Form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-dashed border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-2 text-muted-foreground font-medium uppercase tracking-wider">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-11 font-medium border-dashed border-border bg-transparent hover:bg-accent"
        >
          <Github className="w-4 h-4 mr-2" />
          GitHub
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 font-medium border-dashed border-border bg-transparent hover:bg-accent"
        >
          <Mail className="w-4 h-4 mr-2" />
          Google
        </Button>
      </div>
    </AuthPageShell>
  );
}
