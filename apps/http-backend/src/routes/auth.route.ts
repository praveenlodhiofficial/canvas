import { SignInSchema, SignUpSchema } from "@repo/shared/schema";
import { Router } from "../core/router";
import { z } from "zod";

export function registerAuthRoutes(router: Router) {
  router.post("/api/v1/signup", async (req) => {
    const body = await req.json();
    const parsed = SignUpSchema.safeParse(body);

    if (!parsed.success) {
      const errors = z.treeifyError(parsed.error);
      return Response.json(
        { message: "validation failed", errors },
        { status: 400 }
      )
    }

    return Response.json({ message: "User signed up successfully" });
  })

  router.post("/api/v1/signin", async (req) => {
    const body = await req.json();
    const parsed = SignInSchema.safeParse(body);

    if (!parsed.success) {
      const errors = z.treeifyError(parsed.error);
      return Response.json(
        { message: "validation failed", errors },
        { status: 400 }
      )
    }

    return Response.json({ message: "User signed in successfully" });

  });
}