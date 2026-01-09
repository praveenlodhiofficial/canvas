import { prisma } from "@repo/database";
import { RoomSchema } from "@repo/shared/schema";
import type { AuthenticatedRequest } from "@repo/shared/types";
import { safeParse, z } from "zod";
import { Router } from "@/core/router";
import { authMiddleware } from "@/middleware/auth.middleware";
import { authenticateRequest } from "@/utils/authenticateRequest";

export function registerRoomRoutes(router: Router) {
  // --------------------------------------------> CREATE ROOM ROUTE <--------------------------------------------

  router.post("/api/v1/create-room", async (req) => {
    try {
      // Protect route with auth middleware
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;
      const admin = (req as AuthenticatedRequest).user;

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
      const adminDetails = await prisma.user.findUnique({
        where: {
          id: admin.id,
        },
        select: {
          name: true,
        },
      });

      if (!adminDetails) {
        return Response.json({ message: "User not found" }, { status: 404 });
      }

      const exist = await prisma.room.findFirst({
        where: {
          name: parsed.data.name,
          adminId: admin.id,
        },
      });

      if (exist) {
        return Response.json(
          { message: "Room already exists, please use a different name" },
          { status: 400 },
        );
      }

      const room = await prisma.room.create({
        data: {
          name: parsed.data.name,
          adminId: admin.id,
        },
        include: {
          admin: true,
        },
      });

      return Response.json(
        {
          message: "Room created successfully",
          room: {
            id: room.id,
            name: room.name,
            admin: room.admin.name,
          },
        },
        { status: 201 },
      );
    } catch (error) {
      console.error("Error creating room:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }
  });

  // -------------------------------------------> DELETE ONE ROOM <----------------------------------------------
  router.delete("/api/v1/rooms/:id", async (req, params) => {
    try {
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;
      const admin = (req as AuthenticatedRequest).user;

      const roomId = params.id;

      if (!roomId)
        return Response.json(
          { message: "Room ID is required" },
          { status: 400 },
        );

      const room = await prisma.room.findUnique({
        where: {
          id: roomId,
          adminId: admin.id,
        },
      });

      if (!room) {
        return Response.json({ message: "Room not found" }, { status: 404 });
      }

      await prisma.room.delete({
        where: {
          id: roomId,
        },
      });

      return Response.json(
        { message: "Room deleted successfully" },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error deleting room:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }
  });

  // -------------------------------------------> DELETE ALL ROOMS <----------------------------------------------
  router.delete("/api/v1/rooms", async (req) => {
    try {
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;
      const admin = (req as AuthenticatedRequest).user;

      await prisma.room.deleteMany({
        where: {
          adminId: admin.id,
        },
      });

      return Response.json(
        { message: "All rooms deleted successfully" },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error deleting all rooms:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }
  });

  // ----------------------------------------> FETCH ADMIN'S ALL ROOMS <------------------------------------------

  router.get("/api/v1/rooms", async (req) => {
    try {
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;
      const admin = (req as AuthenticatedRequest).user;

      const adminDetails = await prisma.user.findUnique({
        where: {
          id: admin.id,
        },
        select: {
          name: true,
        },
      });

      if (!adminDetails) {
        return Response.json({ message: "User not found" }, { status: 404 });
      }

      const rooms = await prisma.room.findMany({
        where: {
          adminId: admin.id,
        },
        select: {
          id: true,
          name: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 20,
      });

      return Response.json(
        {
          message: "Rooms fetched successfully",
          rooms: rooms.map((room) => ({
            id: room.id,
            name: room.name,
            updatedAt: room.updatedAt.toISOString(),
          })),
        },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }
  });

  // ----------------------------------------> FETCH ONE ROOM <------------------------------------------
  router.get("/api/v1/rooms/:id", async (req, params) => {
    try {
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;
      const admin = (req as AuthenticatedRequest).user;

      const roomId = params.id;

      if (!roomId)
        return Response.json(
          { message: "Room ID is required" },
          { status: 400 },
        );

      const room = await prisma.room.findUnique({
        where: {
          id: roomId,
          adminId: admin.id,
        },
      });

      if (!room) {
        return Response.json({ message: "Room not found" }, { status: 404 });
      }

      return Response.json(
        { message: "Room fetched successfully", room },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error fetching room:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }
  });

  // ----------------------------------------> RENAME ROOM <------------------------------------------
  router.post("api/v1/rooms/:id/rename", async (req, params) => {
    try {
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;
      const admin = (req as AuthenticatedRequest).user;

      const body = await req.json();
      const parsed = RoomSchema.safeParse(body);

      if (!parsed.success) {
        const errors = z.treeifyError(parsed.error);
        return Response.json(
          { message: "validation failed", errors },
          { status: 400 },
        );
      }

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
          adminId: admin.id,
        },
        select: {
          name: true,
        },
      });

      if (!room) {
        return Response.json({ message: "Room not found" }, { status: 404 });
      }

      if (room.name === parsed.data.name) {
        return Response.json(
          { message: "Room name is the same as the current name" },
          { status: 400 },
        );
      }

      const exist = await prisma.room.findFirst({
        where: {
          name: parsed.data.name,
          adminId: admin.id,
        },
      });

      if (exist) {
        return Response.json(
          { message: "Room name already exists" },
          { status: 400 },
        );
      }

      const updatedRoom = await prisma.room.update({
        where: {
          id: roomId,
        },
        data: {
          name: parsed.data.name,
        },
      });
      return Response.json(
        {
          message: "Room renamed successfully",
          name: updatedRoom.name,
          previousName: room.name,
        },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error renaming room:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }
  });
}
