## `@repo/database` – Prisma + PostgreSQL

Internal database package for Canvas, built with Prisma and PostgreSQL.

Responsibilities:

- Define the Prisma schema for:
  - `User`
  - `Room`
  - `RoomMember`
  - `Shape` (Box, Ellipse, Line, Triangle, Text, etc.)
- Expose a configured Prisma client for other packages to use
- Provide scripts for migrations and schema management

---

## Environment

Set `DATABASE_URL` (or `DATABASE_URL_LOCAL` if you use that convention) in a `.env` file at the repo root or in this package. Example:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/canvas"
```

---

## Scripts

These scripts are intended to be run from **`packages/database`**:

```bash
bun run db:generate  # prisma generate (also runs on postinstall)
bun run db:migrate   # prisma migrate dev
bun run db:push      # prisma db push && prisma generate
bun run db:studio    # open Prisma Studio
bun run db:reset     # reset database (dangerous in non-dev)
bun run check-types  # TypeScript type check (no emit)
```

In most cases you will:

1. Update `prisma/schema.prisma`
2. Run `bun run db:migrate`
3. Commit the migration files and updated client

---

## Usage

Other packages depend on this via `workspace:*` and import from the root:

```ts
import { prisma } from "@repo/database";
```

This package is internal-only and not published to npm.
