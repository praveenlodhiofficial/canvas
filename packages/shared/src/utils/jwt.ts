import jwt from "jsonwebtoken";
import { config } from "../config";

export function signJWT(payload: object) {
  return jwt.sign(payload, config.env.jwtSecret, { expiresIn: "7d" });
}

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, config.env.jwtSecret);
  } catch {
    return null;
  }
}
