const ALLOWED_ORIGIN = "http://localhost:3000";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",

  // TODO: NOT using Authorization header anymore (cookies instead). remove Authorization header later.
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function corsMiddleware(req: Request): Promise<Response | null> {
  // Preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Let request continue, but headers will be added later
  return null;
}

export function withCors(res: Response): Response {
  const headers = new Headers(res.headers);

  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }

  return new Response(res.body, {
    status: res.status,
    headers,
  });
}
