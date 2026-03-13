import { prisma } from "@repo/database";
import { RoomSchema } from "@repo/shared/schema";
import type { AuthenticatedRequest } from "@repo/shared/types";
import { z } from "zod";
import { Router } from "@/core/router";
import { authMiddleware } from "@/middleware/auth.middleware";
import { roomAccessWhere } from "@/utils/permissions/room-access";

export function registerRoomRoutes(router: Router) {
  // --------------------------------------------> CREATE ROOM ROUTE <--------------------------------------------

  router.post("/api/v1/rooms", async (req) => {
    try {
      // auth
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;
      const user = (req as AuthenticatedRequest).user;

      // validate body
      const body = await req.json();
      const parsed = RoomSchema.safeParse(body);

      if (!parsed.success) {
        const errors = z.treeifyError(parsed.error);
        return Response.json(
          { message: "Validation failed", errors },
          { status: 400 }
        );
      }

      // check duplicate room for same admin
      const exist = await prisma.room.findFirst({
        where: {
          name: parsed.data.name,
          adminId: user.id,
        },
      });

      if (exist) {
        return Response.json(
          { message: "Room already exists, please use a different name" },
          { status: 400 }
        );
      }

      // create room + admin membership (TRANSACTION)
      const room = await prisma.room.create({
        data: {
          name: parsed.data.name,
          description: parsed.data.description ?? null,
          visibility: parsed.data.visibility,
          adminId: user.id,

          members: {
            create: {
              userId: user.id,
              role: "ADMIN",
            },
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          visibility: true,
          admin: {
            select: { name: true },
          },
        },
      });

      return Response.json(
        {
          message: "Room created successfully",
          room: {
            id: room.id,
            name: room.name,
            description: room.description,
            visibility: room.visibility,
            admin: room.admin.name,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating room:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  });

  // -------------------------------------------> UPDATE ROOM <----------------------------------------------
  router.put("/api/v1/rooms/:id", async (req, params) => {
    try {
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;
      const admin = (req as AuthenticatedRequest).user;

      const roomId = params.id;
      if (!roomId) {
        return Response.json(
          { message: "Room ID is required" },
          { status: 400 }
        );
      }

      const body = await req.json();
      const parsed = RoomSchema.pick({
        name: true,
        description: true,
        visibility: true,
      }).safeParse(body);

      if (!parsed.success) {
        const errors = z.treeifyError(parsed.error);
        return Response.json(
          { message: "Validation failed", errors },
          { status: 400 }
        );
      }

      const room = await prisma.room.findFirst({
        where: {
          id: roomId,
          adminId: admin.id,
        },
      });

      if (!room) {
        return Response.json({ message: "Room not found" }, { status: 404 });
      }

      // If name is changing, check for duplicate
      if (parsed.data.name !== room.name) {
        const exist = await prisma.room.findFirst({
          where: {
            name: parsed.data.name,
            adminId: admin.id,
          },
        });
        if (exist) {
          return Response.json(
            { message: "Room already exists, please use a different name" },
            { status: 400 }
          );
        }
      }

      await prisma.room.update({
        where: { id: roomId },
        data: {
          name: parsed.data.name,
          description: parsed.data.description ?? null,
          visibility: parsed.data.visibility,
        },
      });

      return Response.json(
        { message: "Room updated successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating room:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
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
          { status: 400 }
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
          adminId: admin.id,
        },
      });

      return Response.json(
        { message: "Room deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting room:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
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
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting all rooms:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
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
          description: true,
          visibility: true,
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
            description: room.description,
            visibility: room.visibility,
            updatedAt: room.updatedAt,
          })),
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  });

  // ----------------------------------------> FETCH MEMBER'S ROOMS <------------------------------------------
  router.get("/api/v1/rooms/member", async (req) => {
    try {
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;

      const user = (req as AuthenticatedRequest).user;

      const rooms = await prisma.room.findMany({
        where: {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
        select: {
          id: true,
          name: true,
          visibility: true,
          updatedAt: true,
          adminId: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      return Response.json(
        {
          message: "Member rooms fetched successfully",
          rooms,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching member rooms:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  });

  // ----------------------------------------> GET ROOM BY ID <------------------------------------------
  router.get("/api/v1/rooms/:id", async (req, params) => {
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
        select: {
          id: true,
          name: true,
          visibility: true,
          adminId: true,
          _count: {
            select: {
              members: true,
            },
          },
        },
      });

      if (!room) {
        return Response.json(
          { message: "You do not have access to this room" },
          { status: 403 }
        );
      }

      return Response.json(
        {
          message: "Room fetched successfully",
          room: {
            id: room.id,
            name: room.name,
            visibility: room.visibility,
            totalMembers: room._count.members + 1, // include admin
          },
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching room:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  });

  // ----------------------------------------> RENAME ROOM <------------------------------------------
  router.post("/api/v1/rooms/:id/rename", async (req, params) => {
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
          { status: 400 }
        );
      }

      const roomId = params.id;

      if (!roomId) {
        return Response.json(
          { message: "Room ID is required" },
          { status: 400 }
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
          { status: 400 }
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
          { status: 400 }
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
        { status: 200 }
      );
    } catch (error) {
      console.error("Error renaming room:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  });

  // ----------------------------------------> SHARE ROOM <------------------------------------------
  router.post("/api/v1/rooms/:id/share", async (req, params) => {
    try {
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;

      const admin = (req as AuthenticatedRequest).user;
      const roomId = params.id;

      if (!roomId) {
        return Response.json(
          { message: "Room ID is required" },
          { status: 400 }
        );
      }

      // Ensure room exists AND requester is admin
      const room = await prisma.room.findFirst({
        where: {
          id: roomId,
          adminId: admin.id,
        },
      });

      if (!room) {
        return Response.json(
          { message: "Room not found or unauthorized" },
          { status: 404 }
        );
      }

      // Make room PUBLIC
      const updatedRoom = await prisma.room.update({
        where: { id: roomId },
        data: {
          visibility: "PUBLIC",
        },
        select: {
          id: true,
          name: true,
          visibility: true,
        },
      });

      return Response.json(
        {
          message: "Room is now public and shareable",
          room: updatedRoom,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error sharing room:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  });

  // ----------------------------------------> JOIN ROOM <------------------------------------------
  router.post("/api/v1/rooms/:id/join", async (req, params) => {
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

      // fetch room
      const room = await prisma.room.findUnique({
        where: { id: roomId },
        select: {
          id: true,
          visibility: true,
          adminId: true,
        },
      });

      if (!room) {
        return Response.json({ message: "Room not found" }, { status: 404 });
      }

      // admin cannot join again
      if (room.adminId === user.id) {
        return Response.json(
          { message: "Admin is already a member of the room" },
          { status: 400 }
        );
      }

      // only PUBLIC rooms can be joined
      if (room.visibility !== "PUBLIC") {
        return Response.json(
          { message: "This room is private" },
          { status: 403 }
        );
      }

      // prevent duplicate membership
      const existingMember = await prisma.roomMember.findFirst({
        where: {
          roomId,
          userId: user.id,
        },
      });

      if (existingMember) {
        return Response.json(
          { message: "User already joined this room" },
          { status: 400 }
        );
      }

      // create membership
      const member = await prisma.roomMember.create({
        data: {
          roomId,
          userId: user.id,
          role: "MEMBER",
        },
        select: {
          id: true,
          role: true,
          joinedAt: true,
        },
      });

      return Response.json(
        {
          message: "Joined room successfully",
          roomId: room.id,
          member,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error joining room:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
