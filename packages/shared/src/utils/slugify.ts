
export function slugify(input: string, opts = { lower: true, maxLength: undefined, fallback: "item" } as {
  lower?: boolean; maxLength?: number; fallback?: string;
}) {
  const { lower = true, maxLength, fallback = "item" } = opts;
  if (!input) return fallback;
  let s = input.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  if (lower) s = s.toLowerCase();
  s = s.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
  if (typeof maxLength === "number" && maxLength > 0) {
    s = s.slice(0, maxLength).replace(/-+$/g, "");
  }
  return s.length > 0 ? s : fallback;
}

export async function uniqueSlugify(
  input: string,
  exists: (slug: string) => Promise<boolean>,
  opts?: { lower?: boolean; maxLength?: number; fallback?: string; maxAttempts?: number }
): Promise<string> {
  const { lower = true, maxLength, fallback = "item", maxAttempts = 1000 } = opts || {};
  const base = slugify(input, { lower, maxLength, fallback });
  if (!(await exists(base))) return base;
  for (let i = 1; i <= maxAttempts; i++) {
    const candidate = `${base}-${i}`;
    if (typeof maxLength === "number" && candidate.length > maxLength) {
      const suffix = `-${i}`;
      const allowedBaseLen = Math.max(1, maxLength - suffix.length);
      const trimmedBase = base.slice(0, allowedBaseLen).replace(/-+$/g, "");
      const candidateTrimmed = `${trimmedBase}${suffix}`;
      if (!(await exists(candidateTrimmed))) return candidateTrimmed;
      continue;
    }
    if (!(await exists(candidate))) return candidate;
  }
  return `${base}-${Date.now()}`;
}
