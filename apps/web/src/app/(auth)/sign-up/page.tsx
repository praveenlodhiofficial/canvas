"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Github, Mail } from "lucide-react";
import { toast } from "sonner";

import { SignUpInput, SignUpSchema } from "@repo/shared/schema";

import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { config } from "@/lib/config";

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
    const response = await fetch(`${config.httpUrl}/api/v1/signup`, {
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
        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in">
            <Button
              variant="link"
              className="text-primary h-auto px-0 font-medium"
            >
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
                    className="bg-background border-border h-11"
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
                <FormLabel className="text-sm font-medium">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    className="bg-background border-border h-11"
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
                      className="bg-background border-border h-11 pr-10"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 px-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button type="submit" className="h-11 w-full font-medium">
            Sign Up
          </Button>
        </form>
      </Form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="border-border w-full border-t border-dashed" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card text-muted-foreground px-2 font-medium tracking-wider uppercase">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="border-border hover:bg-accent h-11 border-dashed bg-transparent font-medium"
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-border hover:bg-accent h-11 border-dashed bg-transparent font-medium"
        >
          <Mail className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
    </AuthPageShell>
  );
}
