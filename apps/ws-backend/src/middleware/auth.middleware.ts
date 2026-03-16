import { prisma } from "@repo/database";
import type { AuthenticatedRequest } from "@repo/shared/types";

import { config } from "../lib/config";
import { authenticateRequest } from "../utils/authenticateRequest";

export type WsAuthResult =
  | { ok: true; payload: AuthenticatedRequest["user"] }
  | { ok: false; response: Response };

export async function authMiddleware(req: Request): Promise<WsAuthResult> {
  const payload = authenticateRequest(req);

  if (!payload) {
    if (config.nodeEnv === "development")
      console.warn("[WS] Auth: unauthorized (no/invalid token)");
    return {
      ok: false,
      response: Response.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  // DB-level protection (deleted users, reset DB, etc.) + load display name
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    if (config.nodeEnv === "development")
      console.warn("[WS] Auth: session expired (user not in DB)");
    return {
      ok: false,
      response: Response.json({ message: "Session expired" }, { status: 401 }),
    };
  }

  const displayName = user.name ?? user.email ?? "Anonymous";
  return {
    ok: true,
    payload: { ...payload, name: displayName },
  };
}
