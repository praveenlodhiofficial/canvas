import { z } from "zod";

import { prisma } from "@repo/database";
import { config } from "@repo/shared";
import { SignInSchema, SignUpSchema } from "@repo/shared/schema";
import { AuthenticatedRequest } from "@repo/shared/types";
import { signJWT } from "@repo/shared/utils";

import { Router } from "@/core/router";
import { authMiddleware } from "@/middleware/auth.middleware";

export function registerAuthRoutes(router: Router) {
  // --------------------------------------------> SIGN UP ROUTE <--------------------------------------------

  router.post("/api/v1/signup", async (req) => {
    try {
      const body = await req.json();
      const parsed = SignUpSchema.safeParse(body);

      console.log("databaseUrl:", config.env.databaseUrl);

      if (!parsed.success) {
        const errors = z.treeifyError(parsed.error);
        return Response.json(
          { message: "validation failed", errors },
          { status: 400 }
        );
      }

      const doesUserExist = await prisma.user.findUnique({
        where: {
          email: parsed.data.email,
        },
      });

      if (doesUserExist) {
        return Response.json(
          { message: "User already exists" },
          { status: 400 }
        );
      }

      const hashedPassword = await Bun.password.hash(parsed.data.password);

      const user = await prisma.user.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          password: hashedPassword,
        },
      });

      return Response.json(
        {
          message: "User signed up successfully",
          name: user.name,
          email: user.email,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error during signup:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  });

  // --------------------------------------------> SIGN IN ROUTE <--------------------------------------------

  // nextjs managing cookies for us
  // router.post("/api/v1/signin", async (req) => {
  //   const body = await req.json();
  //   const parsed = SignInSchema.safeParse(body);

  //   if (!parsed.success) {
  //     return Response.json({ message: "Invalid input" }, { status: 400 });
  //   }

  //   const user = await prisma.user.findUnique({
  //     where: { email: parsed.data.email },
  //   });

  //   if (!user) {
  //     return Response.json({ message: "Invalid credentials" }, { status: 401 });
  //   }

  //   const valid = await Bun.password.verify(
  //     parsed.data.password,
  //     user.password,
  //   );

  //   if (!valid) {
  //     return Response.json({ message: "Invalid credentials" }, { status: 401 });
  //   }

  //   const token = await signJWT({
  //     id: user.id,
  //     email: user.email,
  //   });

  //   return Response.json(
  //     {
  //       token,
  //       user: {
  //         id: user.id,
  //         email: user.email,
  //         name: user.name,
  //       },
  //     },
  //     { status: 200 },
  //   );
  // });

  // http backend managing cookies for us
  router.post("/api/v1/signin", async (req) => {
    const body = await req.json();
    const parsed = SignInSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ message: "Invalid input" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (!user) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const valid = await Bun.password.verify(
      parsed.data.password,
      user.password
    );

    if (!valid) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // 🔑 Generate JWT
    const token = await signJWT({
      id: user.id,
      email: user.email,
    });

    // 🍪 Set cookie
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `session=${token}; HttpOnly; Path=/; SameSite=Lax${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`
    );

    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      }),
      {
        status: 200,
        headers,
      }
    );
  });

  // --------------------------------------------> LOGOUT ROUTE <--------------------------------------------

  router.post("/api/v1/logout", async () => {
    return Response.json({ success: true });
  });

  // ---------------------------------------> GET USER DETAILS ROUTE <---------------------------------------
  router.get("/api/v1/me", async (req) => {
    try {
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;
      const user = (req as AuthenticatedRequest).user;

      const currentUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          name: true,
          email: true,
        },
      });

      if (!currentUser) {
        return Response.json(
          {
            success: false,
            message: "User not found",
          },
          { status: 404 }
        );
      }

      // add success & message to the response
      return Response.json(
        {
          success: true,
          message: "User details fetched successfully",
          user: currentUser,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching user details:", error);
      return Response.json(
        {
          success: false,
          message: "Internal server error",
        },
        { status: 500 }
      );
    }
  });
}
