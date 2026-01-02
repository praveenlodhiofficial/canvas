import { cache } from "react";
import { authFetch } from "@/lib/auth/auth-fetch";
import { config } from "@/lib/config";
import { UserType } from "@repo/shared/schema";

export const getCurrentUser = cache(async () => {
  const data = await authFetch<{
    user: UserType;
  }>(`${config.backendUrl}/api/v1/me`);

  return data.user;
});
