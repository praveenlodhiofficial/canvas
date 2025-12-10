export function extractToken(req: Request): string | null {
  const header = req.headers.get("authorization");

  if (header?.startsWith("Bearer ")) {
    const token = header.split(" ")[1];
    if (token) return token;
  }

  // Fallback for WebSocket upgrade where headers cannot be attached
  const url = new URL(req.url);
  return url.searchParams.get("token");
}
