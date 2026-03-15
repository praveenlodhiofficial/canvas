import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChangePasswordForm } from "./ChangePasswordForm";
import { LogoutAllButton } from "./LogoutAllButton";

export default function AccountSecurityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Security</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Change your password and manage sessions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>
            Enter your current password and choose a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
          <CardDescription>
            Log out from this device. With cookie-based auth, other devices will
            stay signed in until they log out or the session expires.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LogoutAllButton />
        </CardContent>
      </Card>
    </div>
  );
}
