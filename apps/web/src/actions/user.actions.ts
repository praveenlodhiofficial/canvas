"use server";

import { getCurrentUser } from "@/dal/user.dal";
import { UserType } from "@repo/shared/schema";

// --------------------------------------------> GET CURRENT USER ACTION <--------------------------------------------

type GetCurrentUserResult =
  | { success: true; user: UserType }
  | { success: false; user: null };

export const getCurrentUserAction = async (): Promise<GetCurrentUserResult> => {
  try {
    const { success, user } = await getCurrentUser();

    if (!success || !user) {
      return { success: false, user: null };
    }

    return { success: true, user };
  } catch {
    return { success: false, user: null };
  }
};
