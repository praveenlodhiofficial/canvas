## `@repo/shared` – shared schemas, types, and utils

Internal package that centralizes:

- **Runtime validation** with Zod (request/response schemas)
- **Type-only definitions** shared between web, HTTP backend, and WS backend
- **Utility functions** (e.g. auth, configuration helpers)

Exports:

- `@repo/shared` – main barrel (`src/index.ts`)
- `@repo/shared/schema` – Zod schemas for API contracts and entities
- `@repo/shared/types` – TypeScript types/interfaces
- `@repo/shared/utils` – small cross-cutting utilities

---

## Usage

In other workspaces:

```ts
// HTTP or WS backend
import { roomSchema } from "@repo/shared/schema";
import type { CanvasShape } from "@repo/shared/types";
// Web app
import { CanvasShape } from "@repo/shared/types";
```

---

## Scripts

```bash
bun run build  # tsc -b, compiles TypeScript to dist/
```

This package is internal-only (`"private": true`) and is not published to npm. It is intended to be consumed via `workspace:*` references in the monorepo.
