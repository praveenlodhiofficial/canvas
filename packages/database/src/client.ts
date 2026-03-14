import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

import { config } from "@repo/shared";

import { PrismaClient } from "../generated/prisma/client";

if (!config.env.databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaPg({
  connectionString: config.env.databaseUrl,
});

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (config.env.nodeEnv !== "production") globalForPrisma.prisma = prisma;
