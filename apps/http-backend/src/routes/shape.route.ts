import { z } from "zod";

import { prisma } from "@repo/database";
import { CreateShapeSchema } from "@repo/shared/schema";
import { AuthenticatedRequest } from "@repo/shared/types";

import { Router } from "@/core/router";
import { authMiddleware } from "@/middleware/auth.middleware";
import { roomAccessWhere } from "@/utils/permissions/room-access";

export function registerShapeRoutes(router: Router) {
  // ----------------------------------------> SAVE SHAPES <------------------------------------------
  router.post("/api/v1/rooms/:id/shapes", async (req, params) => {
    try {
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;

      const user = (req as AuthenticatedRequest).user;
      const roomId = params.id;

      if (!roomId) {
        return Response.json(
          { message: "Room ID is required" },
          { status: 400 }
        );
      }

      const room = await prisma.room.findFirst({
        where: roomAccessWhere(roomId, user.id),
        select: { id: true },
      });

      if (!room) {
        return Response.json({ message: "Room not found" }, { status: 404 });
      }

      const body = await req.json();
      const parsed = CreateShapeSchema.safeParse(body);

      if (!parsed.success) {
        return Response.json(
          {
            message: "Validation failed",
            errors: z.treeifyError(parsed.error),
          },
          { status: 400 }
        );
      }

      const shape = await prisma.shape.create({
        data: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          type: parsed.data.type as any,
          // type: parsed.data.type,
          x: parsed.data.x,
          y: parsed.data.y,
          width: parsed.data.width,
          height: parsed.data.height,
          points: parsed.data.points,
          roomId,
        },
      });

      return Response.json(
        { message: "Shape saved successfully", shape },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error saving shape:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  });

  // ----------------------------------------> GET ALL SHAPES <------------------------------------------
  router.get("/api/v1/rooms/:id/shapes", async (req, params) => {
    try {
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;
      const user = (req as AuthenticatedRequest).user;

      const roomId = params.id;

      if (!roomId) {
        return Response.json(
          { message: "Room ID is required" },
          { status: 400 }
        );
      }

      const room = await prisma.room.findFirst({
        where: roomAccessWhere(roomId, user.id),
        select: { id: true },
      });

      if (!room) {
        return Response.json({ message: "Room not found" }, { status: 404 });
      }

      const shapes = await prisma.shape.findMany({
        where: { roomId },
        select: {
          id: true,
          type: true,
          x: true,
          y: true,
          width: true,
          height: true,
          points: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      });

      if (!shapes) {
        return Response.json({ message: "No shapes found" }, { status: 404 });
      }

      return Response.json(
        { message: "Shapes fetched successfully", shapes },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error getting shapes:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
