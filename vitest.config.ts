import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Тесты лежат рядом с модулями (src/**/*.test.ts) и покрывают чистые функции
// (расписания, жизненный цикл событий, возрастные корзины) — без БД и рендера.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
