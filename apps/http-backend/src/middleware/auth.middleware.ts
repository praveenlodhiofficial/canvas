import { AuthenticatedRequest } from "@repo/shared/types";
import { authenticateRequest } from "@/utils/authenticateRequest";
import { prisma } from "@repo/database";
import { getCookies } from "@/utils/cookies";

export async function authMiddleware(req: Request) {
  const payload = authenticateRequest(req);

  if (!payload) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 🔴 CRITICAL CHECK (DB reset protection)
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true },
  });

  if (!user) {
    const headers = new Headers();

    const cookies = getCookies(headers, req);
    cookies.delete("session");

    return new Response(JSON.stringify({ message: "Session expired" }), {
      status: 401,
      headers,
    });
  }

  // session is valid
  (req as AuthenticatedRequest).user = payload;
  return null;
}
