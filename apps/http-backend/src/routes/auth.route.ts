import { z } from "zod";

import { prisma } from "@repo/database";
import { SignInSchema, SignUpSchema } from "@repo/shared/schema";
import { AuthenticatedRequest } from "@repo/shared/types";
import { signJWT } from "@repo/shared/utils";

import { Router } from "@/core/router";
import { config } from "@/lib/config";
import { authMiddleware } from "@/middleware/auth.middleware";

export function registerAuthRoutes(router: Router) {
  /* ====================================== SIGN UP ROUTE ====================================== */

  router.post("/api/v1/signup", async (req) => {
    try {
      const body = await req.json();
      const parsed = SignUpSchema.safeParse(body);

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

      // Use explicit argon2id so hashes are stable across Bun versions/restarts (fixes sign-in after hours)
      const hashedPassword = await Bun.password.hash(parsed.data.password, {
        algorithm: "argon2id",
        memoryCost: 65536,
        timeCost: 2,
      });

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
      if (config.nodeEnv === "development")
        console.error("Error during signup:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  });

  /* ====================================== SIGN IN ROUTE ====================================== */

  router.post("/api/v1/signin", async (req) => {
    const body = await req.json();
    const parsed = SignInSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ message: "Invalid input" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        avatarUrl: true,
        username: true,
        theme: true,
      },
    });

    if (!user) {
      if (config.nodeEnv === "development") {
        console.warn(
          "Sign-in failed: no user found for email:",
          parsed.data.email
        );
      }
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const valid = await Bun.password.verify(
      parsed.data.password,
      user.password
    );

    if (!valid) {
      if (config.nodeEnv === "development") {
        console.warn("Sign-in failed: password mismatch for user id:", user.id);
      }
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

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
          avatarUrl: user.avatarUrl,
          username: user.username,
          theme: user.theme,
        },
      }),
      {
        status: 200,
        headers,
      }
    );
  });

  /* ====================================== LOGOUT ROUTE ====================================== */

  router.post("/api/v1/logout", async () => {
    return Response.json({ success: true });
  });

  /* ====================================== GET USER DETAILS ====================================== */
  router.get("/api/v1/me", async (req) => {
    try {
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;
      const user = (req as AuthenticatedRequest).user;

      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          username: true,
          bio: true,
          theme: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              rooms: true,
              roomMembers: true,
            },
          },
        },
      });

      if (!currentUser) {
        return Response.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      const { _count, ...userData } = currentUser;
      return Response.json(
        {
          success: true,
          message: "User details fetched successfully",
          user: {
            ...userData,
            roomsCreatedCount: _count.rooms,
            roomsJoinedCount: _count.roomMembers,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      if (config.nodeEnv === "development")
        console.error("Error fetching user details:", error);
      return Response.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    }
  });

  /* ====================================== UPDATE PROFILE ====================================== */
  router.patch("/api/v1/me", async (req) => {
    try {
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;
      const user = (req as AuthenticatedRequest).user;

      const body = await req.json();
      const { UpdateProfileSchema } = await import("@repo/shared/schema");
      const parsed = UpdateProfileSchema.safeParse(body);

      if (!parsed.success) {
        const errors = z.treeifyError(parsed.error);
        return Response.json(
          { message: "Validation failed", errors },
          { status: 400 }
        );
      }

      const data = parsed.data;

      if (data.username !== undefined && data.username !== null) {
        const existing = await prisma.user.findFirst({
          where: {
            username: data.username,
            id: { not: user.id },
          },
        });
        if (existing) {
          return Response.json(
            { message: "Username is already taken" },
            { status: 400 }
          );
        }
      }

      const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.username !== undefined && { username: data.username }),
          ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
          ...(data.bio !== undefined && { bio: data.bio }),
          ...(data.theme !== undefined && { theme: data.theme }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          username: true,
          bio: true,
          theme: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return Response.json({
        success: true,
        message: "Profile updated",
        user: updated,
      });
    } catch (error) {
      if (config.nodeEnv === "development")
        console.error("Error updating profile:", error);
      return Response.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    }
  });

  /* ====================================== CHANGE PASSWORD ====================================== */
  router.post("/api/v1/account/change-password", async (req) => {
    try {
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;
      const user = (req as AuthenticatedRequest).user;

      const body = await req.json();
      const { ChangePasswordSchema } = await import("@repo/shared/schema");
      const parsed = ChangePasswordSchema.safeParse(body);

      if (!parsed.success) {
        const errors = z.treeifyError(parsed.error);
        return Response.json(
          { message: "Validation failed", errors },
          { status: 400 }
        );
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { password: true },
      });

      if (!dbUser) {
        return Response.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      const valid = await Bun.password.verify(
        parsed.data.currentPassword,
        dbUser.password
      );
      if (!valid) {
        return Response.json(
          { message: "Current password is incorrect" },
          { status: 400 }
        );
      }

      const hashedPassword = await Bun.password.hash(parsed.data.newPassword, {
        algorithm: "argon2id",
        memoryCost: 65536,
        timeCost: 2,
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      return Response.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      if (config.nodeEnv === "development")
        console.error("Error changing password:", error);
      return Response.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
