import { AuthenticatedRequest } from "@repo/shared/types";
import { authenticateRequest } from "@/utils/authenticateRequest";

export async function authMiddleware(req: Request) {
  const payload = authenticateRequest(req);

  if (!payload) return new Response("Unauthorized", { status: 401 });

  (req as AuthenticatedRequest).user = payload;

  return null;
}
