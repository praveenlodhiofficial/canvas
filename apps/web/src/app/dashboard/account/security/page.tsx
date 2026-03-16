import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";
import { LogoutAllButton } from "@/components/account/LogoutAllButton";

export default function AccountSecurityPage() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-200">
          Security
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Change your password and manage sessions
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-neutral-200 bg-neutral-50/80 p-6 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/40 dark:hover:border-neutral-700">
        <div>
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
            Change password
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
            Enter your current password and choose a new one
          </p>
        </div>
        <ChangePasswordForm />
      </div>

      <div className="space-y-4 rounded-xl border border-neutral-200 bg-neutral-50/80 p-6 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/40 dark:hover:border-neutral-700">
        <div>
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
            Sessions
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
            Log out from this device. With cookie-based auth, other devices will
            stay signed in until they log out or the session expires.
          </p>
        </div>
        <LogoutAllButton />
      </div>
    </>
  );
}
