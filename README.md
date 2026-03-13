# Canvas (sketch.io)

A **collaborative whiteboard** where users sign up, create or join rooms, and draw shapes (boxes, ellipses, lines) on a shared canvas with **real-time sync** via WebSockets.

---

## What's inside?

This is a [Turborepo](https://turbo.build/repo) monorepo. All packages are TypeScript.

| Package / App        | Description |
|----------------------|-------------|
| **`apps/web`**       | Next.js 16 frontend — auth, dashboard, rooms list, canvas UI (React 19, Tailwind) |
| **`apps/http-backend`** | Bun REST API — sign up/sign in/logout, rooms CRUD, shapes; JWT in cookies |
| **`apps/ws-backend`**  | Bun WebSocket server — per-room presence, shape add/delete, broadcast |
| **`packages/database`** | Prisma + PostgreSQL — User, Room, RoomMember, Shape |
| **`packages/shared`**  | Zod schemas, types, JWT utils, config — used by both backends and web |
| **`packages/ui`**      | Shared React components (Radix-style exports) |
| **`@repo/eslint-config`** | Shared ESLint config |
| **`@repo/typescript-config`** | Shared `tsconfig` base |

---

## Prerequisites

- **Node.js** ≥ 18
- **Bun** (package manager: `bun@1.2.9`)
- **Docker** (for PostgreSQL, or use a local Postgres instance)

---

## Quick start

### 1. Install dependencies

```bash
bun install
```

### 2. Start PostgreSQL

```bash
bun run docker:up
```

Then set `DATABASE_URL` (or `DATABASE_URL_LOCAL`) in `packages/database` or via `.env` at root. Example:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/canvas"
```

### 3. Generate Prisma client and run migrations

```bash
cd packages/database
bun run db:generate
bun run db:migrate
cd ../..
```

### 4. Run all apps in development

```bash
bun run dev
```

This starts:

- **Web:** [http://localhost:3000](http://localhost:3000)
- **HTTP API:** [http://localhost:3001](http://localhost:3001)
- **WebSocket server:** [ws://localhost:3002](ws://localhost:3002)

Optional env for the web app (e.g. in `apps/web/.env.local`):

- `HTTP_BACKEND_URL` — default `http://localhost:3001`
- `WEBSOCKET_BACKEND_URL` — default `ws://localhost:3002`

### 5. Run a single app

```bash
turbo dev --filter=web
turbo dev --filter=http-backend
turbo dev --filter=ws-backend
```

---

## Scripts

| Command | Description |
|--------|-------------|
| `bun run dev` | Run all apps in dev mode |
| `bun run build` | Build all apps and packages |
| `bun run lint` | Lint all packages |
| `bun run format` | Format with Prettier |
| `bun run check-types` | Type-check all packages |
| `bun run docker:up` | Start PostgreSQL with Docker Compose |
| `bun run docker:down` | Stop Docker Compose |

---

## Features

### Done

- **Auth:** Sign up, sign in, logout (JWT in cookies; backend sets/clears cookie)
- **Rooms:** Create, join, get one, get all (admin), get member rooms; rename, share, delete (single + bulk)
- **Canvas:** Draw box, ellipse, line; selection; keyboard delete; real-time sync (shape add/delete) via WebSocket
- **Persistence:** In-memory shape state per room; DB snapshot when last user leaves

### To do

- [ ] Share room link in a clear, consistent way
- [ ] Invite users to a room
- [ ] Remove users from a room

---

## Logout flow (reference)

```
User clicks Logout
  → Client calls logoutUserAction()
  → DAL → POST /api/v1/logout (with cookie)
  → Backend auth middleware skipped for logout route; cookie cleared
  → Response 200
  → router.refresh()
  → If middleware/proxy runs: no cookie → redirect to /sign-in
```

---

## Useful links

- [Turborepo — Tasks](https://turbo.build/repo/docs/core-concepts/tasks)
- [Turborepo — Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Turborepo — Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
