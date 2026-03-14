import { config as baseConfig } from "@repo/eslint-config/base";
import { bunBackendConfig } from "@repo/eslint-config/bun-backend";
import { nextJsConfig } from "@repo/eslint-config/next-js";
import { config as reactInternalConfig } from "@repo/eslint-config/react-internal";

const withFiles = (configs, patterns) =>
  configs.map((c) => ({ ...c, files: patterns }));

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
    ],
  },
  ...withFiles(nextJsConfig, ["apps/web/**/*.{ts,tsx,js,jsx}"]),
  ...withFiles(bunBackendConfig, [
    "apps/http-backend/**/*.{ts,tsx,js,jsx}",
    "apps/ws-backend/**/*.{ts,tsx,js,jsx}",
  ]),
  ...withFiles(reactInternalConfig, ["packages/ui/**/*.{ts,tsx,js,jsx}"]),
  ...withFiles(baseConfig, ["packages/**/*.{ts,tsx,js,jsx}"]),
];
