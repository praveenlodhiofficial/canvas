import type { UserType } from "@repo/shared/schema";
import type {
  ChangePasswordInput,
  UpdateProfileInput,
} from "@repo/shared/schema";

import { authFetch } from "@/lib/auth/auth-fetch";
import { config } from "@/lib/config";

type MeResponse = {
  success: boolean;
  user: UserType & {
    roomsCreatedCount?: number;
    roomsJoinedCount?: number;
    lastLoginAt?: string | null;
  };
};

export async function fetchMe() {
  const data = await authFetch<MeResponse>(`${config.httpUrl}/api/v1/me`);
  return data;
}

export async function updateProfile(input: UpdateProfileInput) {
  const data = await authFetch<{
    success: boolean;
    message?: string;
    user?: UserType;
  }>(`${config.httpUrl}/api/v1/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return data;
}

export async function changePassword(input: ChangePasswordInput) {
  const data = await authFetch<{ success: boolean; message?: string }>(
    `${config.httpUrl}/api/v1/account/change-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  );
  return data;
}
