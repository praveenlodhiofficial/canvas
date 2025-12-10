import type { AuthPayload } from "@repo/shared/types";
import { authenticateRequest } from "@repo/shared/utils";

// Validates auth token for WebSocket upgrade requests.
export function authMiddleware(req: Request): { payload: AuthPayload } | Response {
  
  const payload = authenticateRequest(req);
  
  if (!payload) return new Response("Unauthorized", { status: 401 });

  return { payload };
}
