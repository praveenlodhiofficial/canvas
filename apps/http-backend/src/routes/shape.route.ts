import { authMiddleware } from "@/middleware/auth.middleware";
import { AuthenticatedRequest } from "@repo/shared/types";
import { Router } from "@/core/router";
import { prisma } from "@repo/database";
import { CreateShapeSchema } from "@repo/shared/schema";
import { z } from "zod";

export function registerShapeRoutes(router: Router) {
  // ----------------------------------------> SAVE SHAPES <------------------------------------------
  router.post("/api/v1/rooms/:id/shapes", async (req, params) => {
    try {
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;

      const admin = (req as AuthenticatedRequest).user;
      const roomId = params.id;

      if (!roomId) {
        return Response.json(
          { message: "Room ID is required" },
          { status: 400 },
        );
      }

      const room = await prisma.room.findFirst({
        where: {
          id: roomId,
          adminId: admin.id, // later: replace with permission check
        },
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
          { status: 400 },
        );
      }

      const shape = await prisma.shape.create({
        data: {
          type: parsed.data.type,
          x: parsed.data.x,
          y: parsed.data.y,
          width: parsed.data.width,
          height: parsed.data.height,
          radius: parsed.data.radius,
          points: parsed.data.points,
          style: parsed.data.style,
          roomId,
        },
      });

      return Response.json(
        { message: "Shape saved successfully", shape },
        { status: 201 },
      );
    } catch (error) {
      console.error("Error saving shape:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }
  });

  // ----------------------------------------> GET ALL SHAPES <------------------------------------------
  router.get("/api/v1/rooms/:id/shapes", async (req, params) => {
    try {
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;
      const admin = (req as AuthenticatedRequest).user;

      const roomId = params.id;

      if (!roomId) {
        return Response.json(
          { message: "Room ID is required" },
          { status: 400 },
        );
      }

      const room = await prisma.room.findFirst({
        where: {
          id: roomId,
          adminId: admin.id, // later: replace with permission check
        },
        select: { id: true },
      });

      if (!room) {
        return Response.json({ message: "Room not found" }, { status: 404 });
      }

      const shapes = await prisma.shape.findMany({
        where: {
          roomId: roomId,
        },
        select: {
          id: true,
          type: true,
          x: true,
          y: true,
          width: true,
          height: true,
          radius: true,
          points: true,
          style: true,
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
        { status: 200 },
      );
    } catch (error) {
      console.error("Error getting shapes:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }
  });
}
