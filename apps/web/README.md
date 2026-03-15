## `apps/web` – Canvas frontend

Next.js 16 app that powers the Canvas UI: authentication, dashboard, rooms list, and the collaborative whiteboard.

It consumes:

- **HTTP API** from `apps/http-backend` for auth, rooms and shapes
- **WebSocket API** from `apps/ws-backend` for real-time presence and canvas sync
- Shared types/schemas from `@repo/shared`

---

## Getting started

From the repo root, install dependencies and start the backends (see root `README.md`), then:

```bash
# from repo root
bun run dev          # runs all apps including web

# or run only the web app
cd apps/web
bun run dev          # next dev --port 3000
```

The app will be available at `http://localhost:3000`.

Required env (usually via `apps/web/.env.local`):

- `HTTP_BACKEND_URL` – base URL of `http-backend` (default `http://localhost:3001`)
- `WEBSOCKET_BACKEND_URL` – URL of `ws-backend` (default `ws://localhost:8080`)

---

## Available scripts

```bash
bun run dev         # Start Next.js in development mode on port 3000
bun run build       # Build the production bundle
bun run start       # Run the production server
bun run lint        # Lint the app (ESLint, zero warnings allowed)
bun run check-types # Generate Next.js types and run TypeScript check (no emit)
```

---

## Key features (frontend)

- **Authentication** — sign up, sign in, logout (JWT in HTTP-only cookie); protected dashboard; theme-aware auth pages.
- **Rooms UI** — create, list, rename, delete rooms; share room links; room cards with visibility.
- **Collaborative canvas** — drawing tools, selection (move + rotate handle), undo/redo, cut/copy/paste, zoom/pan, live cursors and presence (active/idle/offline).
- **Theme-aware design** — light/dark with Next Themes and Tailwind; canvas background and stroke/fill follow theme.

---

## Canvas (detail)

### Drawing tools

| Tool              | Shortcut | Description                                                                                              |
| ----------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| **Select**        | `1`      | Selection box (shapes fully inside); drag to move; rotate handle at top. Cursor: move / grab / grabbing. |
| **Rectangle**     | `2`      | Click-drag to draw a box.                                                                                |
| **Ellipse**       | `3`      | Click-drag to draw an ellipse.                                                                           |
| **Line**          | `4`      | Click-drag for a straight line.                                                                          |
| **Triangle**      | `5`      | Click-drag to draw a triangle.                                                                           |
| **Draw (pencil)** | `6`      | Freehand pencil.                                                                                         |
| **Eraser**        | `7`      | Drag over shapes; removed on mouse release. Cursor: crosshair.                                           |
| **Text**          | `8`      | Click to place; inline input; Enter or blur to commit.                                                   |

Tool shortcuts `1`–`8` are ignored when focus is in an input (e.g. text on canvas).

### Keyboard shortcuts (canvas)

| Action             | Shortcut                 |
| ------------------ | ------------------------ |
| Undo               | Ctrl+Z (⌘Z)              |
| Redo               | Ctrl+Y or Ctrl+Shift+Z   |
| Copy / Cut / Paste | Ctrl+C / Ctrl+X / Ctrl+V |
| Delete selected    | Backspace / Delete       |
| Tools              | `1`–`8` as above         |

Cut/copy/paste/delete are skipped when focus is in an input or textarea.

### Zoom & pan

- **Zoom:** Pinch or Ctrl+wheel; scale 0.25×–4×, centered on cursor.
- **Pan:** Two-finger scroll or wheel (no Ctrl). World coordinates: all tools use logical canvas space; screen-to-world respects zoom/pan.

### Shape types

- **Box** — `x, y, width, height`, optional `rotation`
- **Ellipse** — bounding rect, optional `rotation`
- **Line** — `x, y`, `points[]` (relative)
- **Triangle** — bounding rect, optional `rotation`
- **Text** — `x, y, text, width, height`, optional `rotation`; theme foreground

### Logout flow

User clicks Logout → client calls logout action → POST `/api/v1/logout` (cookie) → backend clears cookie → 200 → `router.refresh()` → redirect to sign-in when no cookie.
