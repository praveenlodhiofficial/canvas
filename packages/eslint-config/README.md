## `@repo/eslint-config` – shared ESLint presets

Internal collection of ESLint configurations used across the Canvas monorepo.

Exports:

- `@repo/eslint-config/base` – base config for TypeScript/node projects
- `@repo/eslint-config/next-js` – rules for Next.js apps
- `@repo/eslint-config/react-internal` – stricter rules for internal React code
- `@repo/eslint-config/bun-backend` – rules tuned for Bun backends (HTTP + WS)

Each preset composes:

- `eslint` and `@eslint/js`
- `typescript-eslint`
- `eslint-config-prettier`
- `eslint-plugin-react`, `eslint-plugin-react-hooks`
- `@next/eslint-plugin-next` for Next.js apps
- `eslint-plugin-turbo` for Turborepo-aware linting

---

## Usage

In a package `eslint.config.mjs` (or similar):

```js
import baseConfig from "@repo/eslint-config/base";
import nextConfig from "@repo/eslint-config/next-js";

export default [
  // pick the preset(s) that match your package
  nextConfig,
  baseConfig,
];
```

This package is **not** published; it is intended for internal use only via `workspace:*`.
