import { AuthPayload } from "../types";
import { extractToken } from "./extractToken";
import { verifyJWT } from "./jwt";

export function authenticateRequest(req: Request): AuthPayload | null {
  const token = extractToken(req);
  if (!token) return null;

  try {
    return verifyJWT(token) as AuthPayload;
  } catch {
    return null;
  }
}
