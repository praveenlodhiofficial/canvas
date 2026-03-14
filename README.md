# Canvas (sketch.io)

A **collaborative whiteboard** where users sign up, create or join rooms, and draw on a shared canvas with **real-time sync** via WebSockets. Supports shapes (rectangle, ellipse, line, triangle), freehand pencil, text, **selection with drag-to-move and rotate handle**, eraser, **zoom (pinch/Ctrl+wheel) and trackpad pan (two-finger scroll)**, **undo/redo** (keyboard), **cut/copy/paste**, **keyboard shortcuts for all tools**, and theme-aware UI (light/dark).

---

## What's inside?

This is a [Turborepo](https://turbo.build/repo) monorepo. All packages are TypeScript.

| Package / App                 | Description                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------- |
| **`apps/web`**                | Next.js 16 frontend — auth, dashboard, rooms list, canvas UI (React 19, Tailwind) |
| **`apps/http-backend`**       | Bun REST API — sign up/sign in/logout, rooms CRUD, shapes; JWT in cookies         |
| **`apps/ws-backend`**         | Bun WebSocket server — per-room presence, shape add/delete, broadcast             |
| **`packages/database`**       | Prisma + PostgreSQL — User, Room, RoomMember, Shape                               |
| **`packages/shared`**         | Zod schemas, types, JWT utils, config — used by both backends and web             |
| **`packages/ui`**             | Shared React components (Radix-style exports)                                     |
| **`@repo/eslint-config`**     | Shared ESLint config                                                              |
| **`@repo/typescript-config`** | Shared `tsconfig` base                                                            |

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

| Command               | Description                          |
| --------------------- | ------------------------------------ |
| `bun run dev`         | Run all apps in dev mode             |
| `bun run build`       | Build all apps and packages          |
| `bun run lint`        | Lint all packages                    |
| `bun run format`      | Format with Prettier                 |
| `bun run check-types` | Type-check all packages              |
| `bun run docker:up`   | Start PostgreSQL with Docker Compose |
| `bun run docker:down` | Stop Docker Compose                  |

---

## Features

### Auth

- **Sign up** — Create account (name, email, password); JWT stored in HTTP-only cookie
- **Sign in** — Email + password; optional “Forgot password” UI
- **Logout** — Clears cookie; backend logout route
- **Auth pages** — Two-column layout (image placeholder + form), theme-aware (light/dark), “Or continue with” Google/GitHub placeholders

### Rooms

- **Create / join** — Create rooms from dashboard; join via room link or list
- **CRUD** — Create, get one, get all (admin), get member rooms; **update** (name, description, visibility), rename, share, delete (single + bulk)
- **Room card** — Shows name, description, visibility; edit and delete from card; share link (copy to clipboard)

### Canvas (whiteboard)

- **Real-time sync** — All shape changes (add, move, delete) sync via WebSocket to everyone in the room
- **Theme** — Canvas background, stroke/fill, and selection colors follow app theme (light/dark); theme toggle refreshes router so canvas and layout stay in sync

#### Drawing tools (toolbar)

| Tool              | Shortcut | Description                                                                                                                                                                                                                                                                                                                           |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Select**        | `1`      | Draw a selection box; only shapes **fully inside** the box are selected. Drag inside the selection to move shapes; use the **rotate handle** (top of selection) to rotate. Cursor: **move** when a shape is selected, **grab** over the rotate handle, **grabbing** while rotating. Dashed bounds, resize handles, and rotate handle. |
| **Rectangle**     | `2`      | Click and drag to draw a rectangle (box).                                                                                                                                                                                                                                                                                             |
| **Ellipse**       | `3`      | Click and drag to draw an ellipse.                                                                                                                                                                                                                                                                                                    |
| **Line**          | `4`      | Click and drag to draw a straight line.                                                                                                                                                                                                                                                                                               |
| **Triangle**      | `5`      | Click and drag to draw a triangle.                                                                                                                                                                                                                                                                                                    |
| **Draw (pencil)** | `6`      | Freehand drawing (pencil).                                                                                                                                                                                                                                                                                                            |
| **Eraser**        | `7`      | Drag over shapes; they are highlighted in a destructive color. Shapes are **removed only when you release** the mouse/trackpad. Cursor: crosshair.                                                                                                                                                                                    |
| **Text**          | `8`      | Click on canvas to place text; type in an inline input (no prompt). Enter or click outside to commit.                                                                                                                                                                                                                                 |

- **Tool shortcuts** — Press **`1`–`8`** to switch tools (no modifier). Shortcuts are ignored when focus is in an input (e.g. while typing text on the canvas).
- **Undo / Redo** — **Ctrl+Z** (or **⌘Z**) to undo, **Ctrl+Y** or **Ctrl+Shift+Z** (or **⌘Y** / **⌘⇧Z**) to redo. Keyboard only; history is local and resets when the room loads.
- **Cut, Copy, Paste** — **Ctrl+C** / **Ctrl+X** / **Ctrl+V** (or **⌘** on Mac). Copy or cut selected shapes; paste places the group **centered on the cursor**. Pasted shapes get new IDs and sync to the room. Shortcuts are skipped when focus is in an input or textarea.
- **Delete** — With shapes selected, **Backspace** or **Delete** removes them and syncs to the room.
- **Zoom** — **Pinch** on trackpad or **Ctrl+wheel** (⌃+scroll) zooms in/out, centered on the cursor. Scale range: 0.25× to 4×.
- **Pan** — **Two-finger scroll** on trackpad (or mouse wheel without Ctrl) pans the canvas: scroll right → left side comes into view, scroll down → top comes into view (natural “grab and drag” direction).
- **Coordinates** — All tools use **world coordinates** (logical canvas space); screen-to-world conversion respects current zoom and pan so drawing, selection, move, and eraser work correctly when zoomed.

#### Keyboard shortcuts (canvas)

| Action          | Shortcut                          |
| --------------- | --------------------------------- |
| Undo            | Ctrl+Z (⌘Z)                       |
| Redo            | Ctrl+Y or Ctrl+Shift+Z (⌘Y / ⌘⇧Z) |
| Copy            | Ctrl+C (⌘C)                       |
| Cut             | Ctrl+X (⌘X)                       |
| Paste           | Ctrl+V (⌘V)                       |
| Delete selected | Backspace / Delete                |
| Select tool     | `1`                               |
| Rectangle       | `2`                               |
| Ellipse         | `3`                               |
| Line            | `4`                               |
| Triangle        | `5`                               |
| Pencil          | `6`                               |
| Eraser          | `7`                               |
| Text            | `8`                               |

#### Shape types

- **Box** — Rectangle with `x, y, width, height` (optional `rotation`)
- **Ellipse** — Ellipse with bounding rect (optional `rotation`)
- **Line** — Line with `x, y` and `points[]` (relative)
- **Triangle** — Triangle with bounding rect (optional `rotation`)
- **Text** — Text with `x, y, text, width, height` (optional `rotation`; stored in DB; rendered with theme foreground)

### Persistence

- **In-memory** — Each room keeps a `Map` of shapes in the WebSocket server
- **Snapshot** — When the last user leaves a room, state is written to PostgreSQL (Shape table: BOX, ELLIPSE, LINE, TEXT, TRIANGLE)
- **On join** — First user to join a room loads shapes from DB into memory and receives `room:init` with current shapes

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
