import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * ESLint config for Bun-based backends (HTTP / WS)
 * @type {import("eslint").Linter.Config[]}
 */
export const bunBackendConfig = [
  ...baseConfig,

  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.es2021,
        ...globals.bun, // ✅ Bun runtime globals
      },
    },
  },

  {
    rules: {
      // Backend-safe rules
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
];
