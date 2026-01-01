import { getCookies } from "./cookies";

export function getSessionToken(req: Request): string | null {
  const cookies = getCookies(new Headers(), req);
  return cookies.get("session") ?? null;
}


// export function getSessionToken(req: Request): string | null {
//   const cookie = req.headers.get("cookie");
//   if (!cookie) return null;

//   return cookie.match(/session=([^;]+)/)?.[1] ?? null;
// }



// export function extractToken(req: Request): string | null {
//   const header = req.headers.get("authorization");

//   if (header?.startsWith("Bearer ")) {
//     const token = header.split(" ")[1];
//     if (token) return token;
//   }

//   // Fallback for WebSocket upgrade where headers cannot be attached
//   const url = new URL(req.url);
//   return url.searchParams.get("token");
// }
