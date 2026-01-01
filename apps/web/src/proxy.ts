// src/proxy.ts
import { config as appConfig } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = appConfig.backendUrl;
const AUTH_PAGES = ["/sign-in", "/sign-up"];
const PROTECTED_PAGES = ["/dashboard", "/rooms"];

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  /* ------------------------ API PROXY ------------------------ */
  if (pathname.startsWith("/api")) {
    const backendUrl = BACKEND_URL + pathname + search;

    const res = await fetch(backendUrl, {
      method: req.method,
      headers: new Headers(req.headers),
      body:
        req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
      credentials: "include",
      // Add this to handle streaming responses properly
      duplex: "half",
    } as RequestInit);

    return new NextResponse(res.body, {
      status: res.status,
      headers: res.headers,
    });
  }

  /* ------------------------ AUTHENTICATION PROTECTION ------------------------ */
  const session = req.cookies.get("session")?.value;
  const isLoggedIn = Boolean(session);

  // Logged-in user should NOT see auth pages
  if (isLoggedIn && AUTH_PAGES.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Not logged-in user should NOT see protected pages
  if (!isLoggedIn && PROTECTED_PAGES.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  /* ---------------- 3️⃣ Continue to Next.js routing ---------------- */
  return NextResponse.next();
}

/* -------- Matcher: Tell Next.js when to run proxy -------- */
export const config = {
  matcher: [
    "/api/:path*",          
    "/dashboard/:path*",    
    "/rooms/:path*",        
    "/sign-in",             
    "/sign-up",             
  ],
};