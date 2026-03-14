export const config = {
  port: process.env.PORT || 3001,
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/postgres",
  nodeEnv: process.env.NODE_ENV || "development",
};
