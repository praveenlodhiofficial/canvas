"use client";

import { useEffect, useState } from "react";

import { useTheme } from "next-themes";

import { Monitor, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

import { updateProfileAction } from "@/actions/account.actions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function AppearanceForm() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleChange(value: string) {
    setTheme(value);
    if (value === "light" || value === "dark" || value === "system") {
      const result = await updateProfileAction({ theme: value });
      if (result.success) {
        toast.success("Theme saved to your account");
      }
    }
  }

  if (!mounted) {
    return (
      <div className="text-muted-foreground text-sm">Loading theme...</div>
    );
  }

  return (
    <RadioGroup
      value={theme ?? "system"}
      onValueChange={handleChange}
      className="flex flex-col gap-3"
    >
      {options.map(({ value, label, icon: Icon }) => (
        <label
          key={value}
          className="border-border has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 flex cursor-pointer items-center gap-3 rounded-md border p-4 transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-800"
        >
          <RadioGroupItem value={value} id={`theme-${value}`} />
          <Icon className="text-muted-foreground size-4" />
          <span className="text-sm font-medium">{label}</span>
        </label>
      ))}
    </RadioGroup>
  );
}
