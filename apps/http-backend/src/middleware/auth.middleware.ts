import { AuthenticatedRequest } from "@repo/shared/types";
import { authenticateRequest } from "@/utils/authenticateRequest";
import { prisma } from "@repo/database";

export async function authMiddleware(req: Request) {
  const payload = authenticateRequest(req);

  if (!payload) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  /* -------- DB-level validation (protect against deleted users) -------- */
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true },
  });

  if (!user) {
    // ❗ Do NOT delete cookies here anymore
    return Response.json({ message: "Session expired" }, { status: 401 });
  }

  // session is valid
  (req as AuthenticatedRequest).user = payload;
  return null;
}
