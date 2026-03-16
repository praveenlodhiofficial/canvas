import { redirect } from "next/navigation";

import { getAccountUserAction } from "@/actions/account.actions";
import { ActivityCard } from "@/components/account/ActivityCard";
import { AppearanceForm } from "@/components/account/AppearanceForm";
import { ProfileCard } from "@/components/account/ProfileCard";

const cardClass =
  "rounded-xl border border-neutral-200 bg-neutral-50/80 p-6 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/40 dark:hover:border-neutral-700";

export default async function AccountPage() {
  const result = await getAccountUserAction();
  if (!result.success || !result.user) redirect("/sign-in");

  const user = result.user;

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-200">
          Account
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Profile, theme, and activity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Row 1: Profile (2 cols) | Workspace Stats (1 col) */}
        <div className={`${cardClass} md:col-span-2`}>
          <ProfileCard user={user} />
        </div>
        <div className={cardClass}>
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Workspace stats
              </h2>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                Rooms created and joined
              </p>
            </div>
            <div className="flex gap-8">
              <div className="space-y-1">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Rooms created
                </p>
                <p className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {user.roomsCreatedCount ?? 0}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Rooms joined
                </p>
                <p className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {user.roomsJoinedCount ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Theme (1 col) | Activity (2 cols) */}
        <div className={cardClass}>
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Theme
              </h2>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                Light, dark, or system
              </p>
            </div>
            <AppearanceForm />
          </div>
        </div>
        <div className={`${cardClass} md:col-span-2`}>
          <ActivityCard user={user} />
        </div>
      </div>
    </>
  );
}
