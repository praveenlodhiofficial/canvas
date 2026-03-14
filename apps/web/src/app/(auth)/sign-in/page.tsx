"use client";

import { Button } from "@/components/ui/button";
import { SignInInput, SignInSchema } from "@repo/shared/schema";
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
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInInput) {
    const res = await fetch("/api/v1/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!res.ok) {
      toast.error("Invalid credentials");
      return;
    }

    toast.success("Signed in successfully");
    router.replace("/dashboard");
  }

  return (
    <AuthPageShell
      title="Welcome back"
      subtitle="Pick up where you left off."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up">
            <Button variant="link" className="px-0 h-auto font-medium text-primary">
              Sign up now
            </Button>
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
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
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium">Password</FormLabel>
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 h-auto text-xs font-medium text-primary"
                  >
                    Forgot password?
                  </Button>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
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
            Sign In
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
