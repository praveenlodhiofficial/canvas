import { Router } from "@/core/router";
import { prisma } from "@repo/database";
import { authMiddleware } from "@/middleware/auth.middleware";

export function registerRoomMemberRoutes(router: Router) {
    // --------------------------------------------> FIND ROOM MEMBERS <--------------------------------------------

    router.get("/api/v1/room-members/:roomId", async (req, { roomId }) => {
        try {
          const authResult = await authMiddleware(req);
          if (authResult) return authResult;

          if (!roomId) {
            return Response.json(
              { message: "Room ID is required" },
              { status: 400 }
            );
          }
      
          const members = await prisma.roomMember.findMany({
            where: {
              roomId,
            },
            select: {
              id: true,
              roomId: true,
              role: true,
              joinedAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          });
      
          return Response.json(
            {
              message: "Room members found",
              members,
            },
            { status: 200 }
          );
      
        } catch (error) {
          console.error("Error finding room members:", error);
      
          return Response.json(
            { message: "Internal server error" },
            { status: 500 }
          );
        }
      });
}