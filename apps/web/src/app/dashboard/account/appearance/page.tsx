import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AppearanceForm } from "./AppearanceForm";

export default function AccountAppearancePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Appearance</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Choose how the app looks. Your preference can be saved to your
          account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Select light, dark, or system (follow your device)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppearanceForm />
        </CardContent>
      </Card>
    </div>
  );
}
