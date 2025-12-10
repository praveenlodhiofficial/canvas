import { verifyJWT } from "../utils/jwt";
import type { AuthenticatedRequest, AuthPayload } from "@repo/shared/types";

export async function authMiddleware(req: Request) {
  const header = req.headers.get("authorization");

  if (!header || !header.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = header.split(" ")[1] || "";
  const payload = verifyJWT(token) as AuthPayload;

  if (!payload) {
    return new Response("Invalid Token", { status: 401 });
  }

  (req as AuthenticatedRequest).user = payload;

  return null;
};