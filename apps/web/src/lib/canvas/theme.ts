/**
 * Canvas theme derived from layout CSS variables.
 * Used so canvas stroke/fill/selection colors match the app theme (light/dark).
 */
export type CanvasTheme = {
  background: string;
  foreground: string;
  primary: string;
  ring: string;
};

const fallback: CanvasTheme = {
  background: "oklch(1 0 0)",
  foreground: "oklch(0.141 0.005 285.823)",
  primary: "oklch(0.65 0.15 250)",
  ring: "oklch(0.705 0.015 286.067)",
};

function getCssVar(name: string): string {
  if (typeof window === "undefined" || typeof document === "undefined")
    return (fallback as Record<string, string>)[name] ?? "";
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || ((fallback as Record<string, string>)[name] ?? "");
}

/** Reads layout CSS variables; pass current theme so callers can depend on it for re-compute. */
export function getCanvasTheme(_currentTheme?: string): CanvasTheme {
  void _currentTheme;
  return {
    background: getCssVar("--background"),
    foreground: getCssVar("--foreground"),
    primary: getCssVar("--primary"),
    ring: getCssVar("--ring"),
  };
}
