import { prisma } from "@repo/database";
import type { AuthenticatedRequest } from "@repo/shared/types";
import { authenticateRequest } from "../utils/authenticateRequest";

export type WsAuthResult =
  | { ok: true; payload: AuthenticatedRequest["user"] }
  | { ok: false; response: Response };

export async function authMiddleware(req: Request): Promise<WsAuthResult> {
  const payload = authenticateRequest(req);

  if (!payload) {
    return {
      ok: false,
      response: Response.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  // DB-level protection (deleted users, reset DB, etc.)
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true },
  });

  if (!user) {
    return {
      ok: false,
      response: Response.json({ message: "Session expired" }, { status: 401 }),
    };
  }

  return {
    ok: true,
    payload,
  };
}
