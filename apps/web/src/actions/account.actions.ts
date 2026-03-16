"use server";

import type { UserType } from "@repo/shared/schema";
import type {
  ChangePasswordInput,
  UpdateProfileInput,
} from "@repo/shared/schema";

import {
  changePassword as changePasswordDal,
  fetchMe,
  updateProfile as updateProfileDal,
} from "@/domains/account/account.dal";

export type AccountUser = UserType & {
  roomsCreatedCount?: number;
  roomsJoinedCount?: number;
  lastLoginAt?: string | null;
};

type GetAccountUserResult =
  | { success: true; user: AccountUser }
  | { success: false; user: null; message?: string };

export async function getAccountUserAction(): Promise<GetAccountUserResult> {
  try {
    const data = await fetchMe();
    if (!data.success || !data.user) {
      return { success: false, user: null, message: data.message };
    }
    return {
      success: true,
      user: data.user as AccountUser,
    };
  } catch {
    return { success: false, user: null };
  }
}

type UpdateProfileResult =
  | { success: true; user: UserType }
  | { success: false; message: string };

export async function updateProfileAction(
  input: UpdateProfileInput
): Promise<UpdateProfileResult> {
  try {
    const data = await updateProfileDal(input);
    if (!data.success) {
      return { success: false, message: data.message ?? "Update failed" };
    }
    return { success: true, user: data.user! };
  } catch {
    return { success: false, message: "Failed to update profile" };
  }
}

type ChangePasswordResult =
  | { success: true }
  | { success: false; message: string };

export async function changePasswordAction(
  input: ChangePasswordInput
): Promise<ChangePasswordResult> {
  try {
    const data = await changePasswordDal(input);
    if (!data.success) {
      return {
        success: false,
        message: data.message ?? "Change password failed",
      };
    }
    return { success: true };
  } catch {
    return { success: false, message: "Failed to change password" };
  }
}
