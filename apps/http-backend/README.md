## `apps/http-backend` – REST API

TypeScript + Bun HTTP backend that exposes the REST API for Canvas:

- Authentication (sign up, sign in, logout)
- Room management (create, list, update, delete)
- Shape persistence (load/save room shapes via `@repo/database`)
- JWT-based sessions with cookies, shared types and schemas from `@repo/shared`

---

## Getting started

From the repo root, make sure you have:

- PostgreSQL running and `@repo/database` migrations applied (see root `README.md`)
- A `.env.development` file in `apps/http-backend` with at least:

```bash
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/canvas"
JWT_SECRET="change-me"
```

Then run:

```bash
cd apps/http-backend

# development (auto-reload)
bun run dev          # bun --watch --env-file=.env.development src/index.ts

# build & start (production-style)
bun run build        # tsc -b
bun run start        # bun run dist/index.js
```

The API will listen on `http://localhost:3001` by default.

---

## Available scripts

```bash
bun run dev         # Start backend in dev mode (watch, env from .env.development)
bun run build       # TypeScript build (outputs to dist/)
bun run start       # Run compiled backend with Bun
bun run lint        # ESLint (zero warnings allowed)
bun run check-types # TypeScript type check (no emit)
```

---

## High-level architecture

- **`src/index.ts`** – entrypoint, server bootstrap
- **Auth**
  - `getToken.ts` – helpers to read/write session token
  - `authenticateRequest.ts` – verifies identity from JWT
  - `authMiddleware.ts` – attaches `req.user` to the request
- **Routes**
  - Auth routes (sign up, sign in, logout)
  - Room routes (CRUD, membership)
  - Shapes routes (load/save shapes for a room)

Routes and services trust `req.user` populated by the auth middleware. Types, schemas, and validation logic are shared via `@repo/shared`.
