import { prisma } from "@repo/database";
import { config } from "@repo/shared";
import { SignInSchema, SignUpSchema, UserSchema } from "@repo/shared/schema";
import { signJWT } from "@repo/shared/utils";
import { z } from "zod";
import { Router } from "@/core/router";
import { getCookies } from "@/utils/cookies";
import { authMiddleware } from "@/middleware/auth.middleware";
import { AuthenticatedRequest } from "@repo/shared/types";

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

  router.post("/api/v1/signin", async (req) => {
    try {
      const body = await req.json();
      const parsed = SignInSchema.safeParse(body);

      if (!parsed.success) {
        const errors = z.treeifyError(parsed.error);
        return Response.json(
          { message: "validation failed", errors },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: {
          email: parsed.data.email,
        },
      });

      if (!user) {
        return Response.json(
          { message: "User not found or credentials are incorrect" },
          { status: 404 }
        );
      }

      const isPasswordValid = await Bun.password.verify(
        parsed.data.password,
        user.password
      );

      if (!isPasswordValid) {
        return Response.json(
          { message: "User not found or credentials are incorrect" },
          { status: 404 }
        );
      }

      const token = await signJWT({
        id: user.id,
        email: user.email,
      });

      const headers = new Headers();
      const cookies = getCookies(headers, req);

      cookies.set("session", token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days - TODO: Use the environment variable for the max age
        path: "/",
        sameSite: "none",
      });

      return Response.json(
        {
          message: "User signed in successfully",
          email: user.email,
        },
        { status: 200, headers }
      );
    } catch (error) {
      console.error("Error during signin:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  });

  // --------------------------------------------> LOGOUT ROUTE <--------------------------------------------
  router.post("/api/v1/logout", async (req) => {
    try {
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;

      // headers to be sent back to the client & cookies to be deleted
      const headers = new Headers();
      const cookies = getCookies(headers, req);

      cookies.delete("session");

      return Response.json(
        { message: "User logged out successfully" },
        {
          status: 200,
          headers,
        }
      );
    } catch (error) {
      console.error("Error during logout:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  });

  // ---------------------------------------> GET USER DETAILS ROUTE <---------------------------------------
  router.get("/api/v1/me", async (req) => {
    try {
      const cookies = getCookies(new Headers(), req);

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
        return Response.json({ message: "User not found" }, { status: 404 });
      }

      return Response.json(
        {
          message: "User details fetched successfully",
          user: currentUser,
          cookies: cookies.get("session"),
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching user details:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
