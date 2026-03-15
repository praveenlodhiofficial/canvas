## `apps/ws-backend` – WebSocket server

TypeScript + Bun WebSocket backend that powers real-time collaboration for Canvas:

- Manages per-room presence (who is online in which room)
- Broadcasts live cursor positions
- Broadcasts shape events (add/delete) between clients
- Persists room snapshots to PostgreSQL via `@repo/database`

It shares types and message shapes with the rest of the monorepo through `@repo/shared`.

---

## Getting started

Prerequisites:

- PostgreSQL running with the `@repo/database` migrations applied
- `.env.development` in `apps/ws-backend`, for example:

```bash
PORT=8080
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/canvas"
JWT_SECRET="change-me"
```

Then run:

```bash
cd apps/ws-backend

# development (auto-reload)
bun run dev          # bun --watch --env-file=.env.development src/index.ts

# build & start (production-style)
bun run build        # tsc -b
bun run start        # bun run dist/index.js
```

WebSocket clients should connect to `ws://localhost:8080` (configurable via env).

---

## Available scripts

```bash
bun run dev         # Start WebSocket server in dev mode
bun run build       # TypeScript build (outputs to dist/)
bun run start       # Run compiled server with Bun
bun run lint        # ESLint (zero warnings allowed)
bun run check-types # TypeScript type check (no emit)
```

---

## Responsibilities

- Keep **in-memory state** of shapes per room while users are connected
- Write shapes to the database when the last user leaves a room
- Rehydrate room shapes from DB when the first user joins
- Fan-out:
  - `cursor_move` events
  - canvas shape events (add/delete/clear)
  - presence updates (join/leave)
