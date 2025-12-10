import type { AuthenticatedRequest } from "@repo/shared/types";
import { Router } from "../core/router";
import { authMiddleware } from "../middleware/auth.middleware";

export function registerRoomRoutes(router: Router) {
  router.post("/api/v1/create-room", async (req) => {
    // Protect route with auth middleware
    const authResult = await authMiddleware(req);
    if (authResult) return authResult;

    const user = (req as AuthenticatedRequest).user;

    const { name } = await req.json();
    return Response.json({
      message: "Room created successfully",
      name,
      createdBy: user?.id
    });
  }); 
}