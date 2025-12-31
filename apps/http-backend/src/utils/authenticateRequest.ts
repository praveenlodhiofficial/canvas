import { AuthPayload } from "@repo/shared/types";
import { extractToken } from "./extractToken";
import { verifyJWT } from "@repo/shared/utils";

export function authenticateRequest(req: Request): AuthPayload | null {
  const token = extractToken(req);
  if (!token) return null;

  try {
    return verifyJWT(token) as AuthPayload;
  } catch {
    return null;
  }
}
