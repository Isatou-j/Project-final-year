import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      ".history/**",
      "**/.env",
      "src/prisma/generated/**",
      "*.config.js",
      "*.config.ts",
      "*.config.mjs",
      "./coverage/**",
    ],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "prettier/prettier": [
        "error",
        {
          semi: true,
          singleQuote: true,
          printWidth: 80,
          tabWidth: 2,
          trailingComma: "all",
          endOfLine: "auto",
          arrowParens: "avoid",
          bracketSameLine: false,
          bracketSpacing: true,
        },
      ],
    },
  },
]);
