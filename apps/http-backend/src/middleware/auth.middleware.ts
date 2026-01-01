import { AuthenticatedRequest } from "@repo/shared/types";
import { authenticateRequest } from "@/utils/authenticateRequest";

export function authMiddleware(req: Request) {
  const payload = authenticateRequest(req);

  if (!payload)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  (req as AuthenticatedRequest).user = payload;

  return null;
}
