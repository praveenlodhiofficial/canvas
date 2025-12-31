import { Cookies } from "@repo/shared/types";

export function createCookies(resHeaders: Headers, req: Request): Cookies {
    return {
      get(key) {
        const cookie = req.headers.get("cookie");
        return cookie?.match(new RegExp(`${key}=([^;]+)`))?.[1];
      },
  
      set(key, value, options = {}) {
        const parts = [`${key}=${value}`];
  
        if (options.httpOnly) parts.push("HttpOnly");
        if (options.secure) parts.push("Secure");
        if (options.sameSite) parts.push(`SameSite=${capitalize(options.sameSite)}`);
        if (options.maxAge) parts.push(`Max-Age=${options.maxAge}`);
        if (options.path) parts.push(`Path=${options.path}`);
  
        resHeaders.append("Set-Cookie", parts.join("; "));
      },
  
      delete(key) {
        resHeaders.append(
          "Set-Cookie",
          `${key}=; Max-Age=0; Path=/`,
        );
      },
    };
  }
  
export function capitalize(v: string) {
  return v.charAt(0).toUpperCase() + v.slice(1);
}