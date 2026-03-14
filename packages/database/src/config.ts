import "dotenv/config";

export const config = {
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/canvas?schema=public",
};
