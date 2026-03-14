import { AuthPayload } from "@repo/shared/types";
import { verifyJWT } from "@repo/shared/utils";

import { getSessionToken } from "./token";

export function authenticateRequest(req: Request): AuthPayload | null {
  const token = getSessionToken(req);
  if (!token) return null;

  try {
    return verifyJWT(token) as AuthPayload;
  } catch {
    return null;
  }
}
