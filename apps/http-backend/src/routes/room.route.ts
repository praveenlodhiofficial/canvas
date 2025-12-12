  import type { AuthenticatedRequest } from "@repo/shared/types";
  import { z } from "zod";
  import { Router } from "../core/router";
  import { authMiddleware } from "../middleware/auth.middleware";
  import { prisma } from "@repo/database";
  import { RoomSchema } from "@repo/shared/schema";
import { uniqueSlugify } from "@repo/shared/utils";

  export function registerRoomRoutes(router: Router) {

    // --------------------------------------------> CREATE ROOM ROUTE <--------------------------------------------

    router.post("/api/v1/create-room", async (req) => {

      // Protect route with auth middleware
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;
      const user = (req as AuthenticatedRequest).user;

      const body = await req.json();
      const parsed = RoomSchema.safeParse(body);

      if (!parsed.success) {
        const errors = z.treeifyError(parsed.error);
        return Response.json(
          { message: "validation failed", errors },
          { status: 400 },
        );
      }

      // fetch user name from database
      const userDetails = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          name: true,
        },
      });

      if (!userDetails) {
        return Response.json({ message: "User not found" }, { status: 404 });
      }

      const slug = await uniqueSlugify(parsed.data.name, async (slug) => {
        return (await prisma.room.findFirst({
          where: { slug },
        })) !== null;
      }, {
        maxAttempts: 10,
        fallback: `room-by-${userDetails.name}`,
        maxLength: 20,
        lower: true,
      });

      const room = await prisma.room.create({
        data: {
          name: parsed.data.name,
          slug: slug,
          createdById: user.id,
        },
        include: {
          createdBy: true,
        },
      });

      return Response.json({
        message: "Room created successfully",
        name: room.name,
        slug: room.slug,
        createdBy: userDetails.name,
      }, { status: 201 });
    });
  }
