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
import { toast } from "sonner"
import { useRouter } from "next/navigation";

export default function SignInPage() {

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
      router.push("/");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-4 items-center justify-center">

        {/* Sign In Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full min-w-xs border p-4 rounded-md">
          <h1 className="text-xl font-bold text-center uppercase">Sign In Page</h1>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Sign In</Button>
          </form>
        </Form>

        {/* if don't have an account, redirect to sign up page */}
        <p className="text-sm text-center">Don&apos;t have an account? <Link href="/sign-up" className="text-blue-500 hover:text-blue-600">Sign Up</Link></p>
      </div>
    </div>
  );
}
