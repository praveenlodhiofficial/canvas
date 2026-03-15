import { redirect } from "next/navigation";

import { getAccountUserAction } from "@/actions/account.actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { EditProfileForm } from "./EditProfileForm";

export default async function EditProfilePage() {
  const result = await getAccountUserAction();
  if (!result.success || !result.user) redirect("/sign-in");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Edit profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Update your name, username, and profile picture
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Name, username, and avatar URL</CardDescription>
        </CardHeader>
        <CardContent>
          <EditProfileForm user={result.user} />
        </CardContent>
      </Card>
    </div>
  );
}
