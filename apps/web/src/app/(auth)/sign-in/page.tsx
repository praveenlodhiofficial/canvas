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
import { ArrowLeft, Github, Mail } from "lucide-react";
import { Pencil } from "lucide-react";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { useState } from "react";

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
    // TODO: Use the backend URL from the environment variables
    const response = await fetch(`http://localhost:3001/api/v1/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("error:", error);
      toast.error(error.message);
      return;
    }

    // if user not found or credentials are incorrect, show toast error and redirect to sign in page
    if (response.status === 400) {
      toast.error("User not found or credentials are incorrect");
      return;
    } else {
      const responseData = await response.json();
      console.log("responseData:", responseData);
      toast.success("User signed in successfully");
      router.replace("/dashboard");
    }
  }

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-100 bg-background text-foreground relative flex items-center justify-center p-4">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-50/50 via-background to-background" />

      <div className="w-full max-w-[440px] animate-in fade-in zoom-in duration-300">
        <Link href="/">
          <Button
            variant="ghost"
            className="mb-8 hover:bg-transparent px-0 text-muted-foreground hover:text-foreground font-bold flex gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Button>
        </Link>

        <div className="bg-white/80 backdrop-blur-xl sketch-border p-8 md:p-12 shadow-2xl border-border/50">
          <div className="text-center mb-10">
            <div
              className="w-12 h-12 flex items-center justify-center sketch-border mx-auto mb-6 bg-brand border-brand text-white"
            >
              <Pencil className="w-6 h-6 transform -rotate-12" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground font-medium">
              Pick up where you left off.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        className="h-12 sketch-border border-border font-medium focus-visible:ring-indigo-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-bold" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="font-bold text-sm">
                        Password
                      </FormLabel>
                      <Button
                        variant="link"
                        className="px-0 font-bold text-xs text-brand"
                      >
                        {/* TODO: Add a forgot password Functionality */}
                        Forgot password?
                      </Button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="h-12 sketch-border border-border font-medium focus-visible:ring-indigo-500/20 pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 px-0 text-muted-foreground"
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
                    <FormMessage className="text-xs font-bold" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-14 text-lg sketch-border font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] bg-brand border-brand text-white"
              >
                Sign In
              </Button>
            </form>
          </Form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/80 px-2 text-muted-foreground font-black tracking-widest">
                Or continue with
              </span>
            </div>
          </div>

          {/* TODO: Add OAuth Functionality to sign in with GitHub and Google */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-12 sketch-border border-border font-bold flex gap-2 bg-transparent"
            >
              <Github className="w-4 h-4" />
              GitHub
            </Button>
            <Button
              variant="outline"
              className="h-12 sketch-border border-border font-bold flex gap-2 bg-transparent"
            >
              <Mail className="w-4 h-4" />
              Google
            </Button>
          </div>

          <p className="mt-10 text-center text-sm font-semibold text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up">
              <Button
                variant="link"
                className="px-0 font-bold text-brand"
              >
                Sign up now
              </Button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
