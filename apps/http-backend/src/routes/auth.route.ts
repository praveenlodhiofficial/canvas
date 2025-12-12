import { prisma } from "@repo/database";
import { config } from "@repo/shared";
import { SignInSchema, SignUpSchema } from "@repo/shared/schema";
import { z } from "zod";
import { Router } from "../core/router";
import { signJWT } from "@repo/shared/utils";

export function registerAuthRoutes(router: Router) {

  // --------------------------------------------> SIGN UP ROUTE <--------------------------------------------

  router.post("/api/v1/signup", async (req) => {
    const body = await req.json();
    const parsed = SignUpSchema.safeParse(body);

    console.log("databaseUrl:", config.env.databaseUrl);

    if (!parsed.success) {
      const errors = z.treeifyError(parsed.error);
      return Response.json(
        { message: "validation failed", errors },
        { status: 400 },
      );
    }

    const doesUserExist = await prisma.user.findUnique({
      where: {
        email: parsed.data.email,
      },
    });

    if (doesUserExist) {
      return Response.json({ message: "User already exists" }, { status: 400 });
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
      { message: "User signed up successfully", name: user.name, email: user.email },
      { status: 201 },
    );
  });

  // --------------------------------------------> SIGN IN ROUTE <--------------------------------------------

  router.post("/api/v1/signin", async (req) => {
    const body = await req.json();
    const parsed = SignInSchema.safeParse(body);

    if (!parsed.success) {
      const errors = z.treeifyError(parsed.error);
      return Response.json(
        { message: "validation failed", errors },
        { status: 400 },
      );
    }

    const doesUserExist = await prisma.user.findUnique({
      where: {
        email: parsed.data.email,
      },
    });

    if (!doesUserExist) {
      return Response.json({ message: "User not found or credentials are incorrect" }, { status: 404 });
    }

    const isPasswordValid = await Bun.password.verify(parsed.data.password, doesUserExist.password);

    if (!isPasswordValid) {
      return Response.json({ message: "User not found or credentials are incorrect" }, { status: 404 });
    }

    const token = await signJWT({ id: doesUserExist.id, email: doesUserExist.email });

    const user = {
      email: doesUserExist.email,
      password: doesUserExist.password,
    };

    return Response.json({ message: "User signed in successfully", email: user.email, token });
  });
}
