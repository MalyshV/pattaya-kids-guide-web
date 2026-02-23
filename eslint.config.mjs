import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    rules: {
      "eol-last": ["error", "always"],
      quotes: ["error", "double"],
      semi: ["error", "always"],
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  eslintConfigPrettier,
]);
