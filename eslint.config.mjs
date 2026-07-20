import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    rules: {},
  },

  // .claude — служебное Claude Code (сессии, git-worktree агентов): их
  // .next/types иначе засыпают линт тысячами чужих ошибок
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", ".claude/**"]),

  eslintConfigPrettier,
]);
