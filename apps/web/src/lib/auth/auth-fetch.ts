import { getAuthCookieHeader } from "./cookies";

type AuthFetchOptions = RequestInit & {
  forwardCookies?: boolean;
};

export async function authFetch<T>(
  url: string,
  options: AuthFetchOptions = {},
): Promise<T> {
  const { forwardCookies = true, ...rest } = options;

  const headers: Record<string, string> = {
    ...(rest.headers as Record<string, string> | undefined),
  };

  if (forwardCookies) {
    headers["Cookie"] = await getAuthCookieHeader();
  }

  const res = await fetch(url, {
    ...rest,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("UNAUTHORIZED");
  }

  return res.json();
}
