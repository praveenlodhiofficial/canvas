# Canvas

A **collaborative whiteboard**: sign up, create or join rooms, draw on a shared canvas with **real-time sync** via WebSockets. Shapes, pencil, text, selection (move/rotate), eraser, zoom/pan, undo/redo, cut/copy/paste, keyboard shortcuts, theme-aware UI (light/dark).

---

## What's inside?

[Turborepo](https://turbo.build/repo) monorepo. All packages are TypeScript.

| Package / App                 | Description                                                     |
| ----------------------------- | --------------------------------------------------------------- |
| **`apps/web`**                | Next.js 16 frontend — auth, dashboard, rooms, canvas (React 19) |
| **`apps/http-backend`**       | Bun REST API — auth, rooms CRUD, shapes; JWT in cookies         |
| **`apps/ws-backend`**         | Bun WebSocket — presence, cursors, shape sync, room snapshot    |
| **`packages/database`**       | Prisma + PostgreSQL — User, Room, RoomMember, Shape             |
| **`packages/shared`**         | Zod schemas, types, JWT utils — used by backends and web        |
| **`packages/ui`**             | Shared React components (Radix-style)                           |
| **`@repo/eslint-config`**     | Shared ESLint config                                            |
| **`@repo/typescript-config`** | Shared `tsconfig` base                                          |

Details, scripts, and env for each app: see that app’s `README.md`.

---

## Prerequisites

- **Node.js** ≥ 22
- **Bun** (runtime + package manager)
- **Docker** or local PostgreSQL

---

## Quick start

```bash
bun install
bun run docker:up                    # start Postgres (or use existing)
# Set DATABASE_URL (e.g. in packages/database or root .env)
cd packages/database && bun run db:generate && bun run db:migrate && cd ../..
bun run dev
```

- **Web:** http://localhost:3000
- **HTTP API:** http://localhost:3001
- **WebSocket:** ws://localhost:8080

Run one app: `turbo dev --filter=web` | `--filter=http-backend` | `--filter=ws-backend`

---

## Scripts (root)

| Command               | Description               |
| --------------------- | ------------------------- |
| `bun run dev`         | Run all apps in dev       |
| `bun run build`       | Build all apps & packages |
| `bun run lint`        | Lint all                  |
| `bun run format`      | Format (Prettier)         |
| `bun run check-types` | Type-check all            |
| `bun run docker:up`   | Start PostgreSQL          |
| `bun run docker:down` | Stop Docker Compose       |

---

## Features (high level)

- **Auth** — Sign up, sign in, logout; JWT in HTTP-only cookie; theme-aware auth pages.
- **Rooms** — Create, join, CRUD, rename, share link, delete; room cards with visibility.
- **Canvas** — Real-time shape sync; theme-aware canvas; live remote cursors and presence (active/idle/offline).
- **Persistence** — Shapes in memory per room; snapshot to PostgreSQL when room empties; load from DB on first join.

### Canvas tools & shortcuts

| Tool      | Shortcut | Tool   | Shortcut |
| --------- | -------- | ------ | -------- |
| Select    | `1`      | Pencil | `6`      |
| Rectangle | `2`      | Eraser | `7`      |
| Ellipse   | `3`      | Text   | `8`      |
| Line      | `4`      |        |          |
| Triangle  | `5`      |        |          |

**Keyboard:** Undo Ctrl+Z · Redo Ctrl+Y / Ctrl+Shift+Z · Copy Ctrl+C · Cut Ctrl+X · Paste Ctrl+V · Delete Backspace/Delete

**Zoom:** Ctrl+wheel or pinch · **Pan:** two-finger scroll / wheel

Full tool descriptions, shape types, and canvas behavior: **`apps/web/README.md`**.

---

## Useful links

- [Turborepo — Tasks](https://turbo.build/repo/docs/core-concepts/tasks)
- [Turborepo — Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Turborepo — Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
