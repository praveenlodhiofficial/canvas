# Deploying ws-backend to Railway

This app is part of a Bun monorepo and uses `workspace:*` dependencies. Railway’s default build runs from this directory and uses npm, which doesn’t support `workspace:*`, so the build fails.

Use **one** of these approaches.

## Option A: Dockerfile (recommended)

1. In the **ws-backend** service:
   - **Root Directory**: leave empty or set to `/` (monorepo root).
   - **Dockerfile Path**: `apps/ws-backend/Dockerfile`
2. Railway will build with the Dockerfile. The Docker build context is the repo root, so `bun install` and workspace deps work.
3. Set **Start Command** to: `bun run start` (or leave default; the Dockerfile already sets `CMD`).
4. Add **Variables** (e.g. `DATABASE_URL`, `PORT`).

## Option B: Railpack from repo root (no Dockerfile)

1. **Root Directory**: leave empty or set to the **monorepo root** (not `apps/ws-backend`).
2. **Build Command**:  
   `bun install --frozen-lockfile && bunx turbo run build --filter=ws-backend`  
   (or: `bun install --frozen-lockfile && cd apps/ws-backend && bun run build`)
3. **Start Command**:  
   `cd apps/ws-backend && bun run start`
4. **Watch Paths** (optional): `apps/ws-backend/**`, `packages/database/**`, `packages/shared/**` so only relevant changes trigger deploys.

With the root at the repo, Railpack sees `bun.lock` and uses Bun instead of npm.
