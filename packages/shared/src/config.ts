import dotenv from "dotenv";
import { resolve } from "path";
import { z } from "zod";

// Load .env from monorepo root or cwd
const envCandidates = [
  resolve(__dirname, "../../../.env"),
  resolve(process.cwd(), ".env"),
];

for (const candidate of envCandidates) {
  dotenv.config({ path: candidate });
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  DATABASE_URL: z.string().url({
    message: "DATABASE_URL must be a valid URL",
  }),

  JWT_SECRET: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const error = z.treeifyError(parsed.error);
  console.error(error);
  throw new Error(`Invalid environment variables → ${error}`);
}

const env = parsed.data;

export const config = {
  env: {
    nodeEnv: env.NODE_ENV,
    databaseUrl: env.DATABASE_URL, // <— USE THIS EVERYWHERE
    jwtSecret: env.JWT_SECRET,
  },

  isDev: env.NODE_ENV === "development",
  isTest: env.NODE_ENV === "test",
  isProd: env.NODE_ENV === "production",
} as const;
