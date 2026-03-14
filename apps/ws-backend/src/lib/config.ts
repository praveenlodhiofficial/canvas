export const config = {
  port: process.env.PORT || 3002,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/postgres",
  snapshotInterval: Number(process.env.SNAPSHOT_INTERVAL) || 30000,
};
