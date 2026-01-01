import { AuthPayload } from "@repo/shared/types";
import { getSessionToken } from "./token";
import { verifyJWT } from "@repo/shared/utils";

export function authenticateRequest(req: Request): AuthPayload | null {
  const token = getSessionToken(req);
  if (!token) return null;

  try {
    return verifyJWT(token) as AuthPayload;
  } catch {
    return null;
  }
}
