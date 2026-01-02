import { cookies } from "next/headers";

/**
 * Returns cookie header string for forwarding
 * Safe to use only in Server Components / Server Actions
 */
export async function getAuthCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore.toString();
}
