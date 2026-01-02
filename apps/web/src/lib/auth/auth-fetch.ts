import { getAuthCookieHeader } from "./cookies";

export async function authFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Cookie: await getAuthCookieHeader(),
    },
    cache: "no-store", // auth-sensitive
  });

  if (!res.ok) {
    throw new Error(`Auth fetch failed: ${res.status}`);
  }

  return res.json();
}
