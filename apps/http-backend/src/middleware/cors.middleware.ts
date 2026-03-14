import { config } from "@/lib/config";

const corsHeaders = {
  "Access-Control-Allow-Origin": config.corsOrigin,
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Origin",
  "Access-Control-Allow-Credentials": "true",
  Vary: "Origin",
};

export async function corsMiddleware(req: Request): Promise<Response | null> {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

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
