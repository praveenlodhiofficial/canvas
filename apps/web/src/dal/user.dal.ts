import { UserType } from "@repo/shared/schema";

import { authFetch } from "@/lib/auth/auth-fetch";
import { config } from "@/lib/config";

/* ----------------------> GET CURRENT USER DAL FUNCTION <-------------------------- */
export const getCurrentUser = async () => {
  try {
    const data = await authFetch<{
      success: boolean;
      user: UserType;
    }>(`${config.backendUrl}/api/v1/me`);

    return { success: data.success, user: data.user };
  } catch {
    return { success: false, user: null };
  }
};
