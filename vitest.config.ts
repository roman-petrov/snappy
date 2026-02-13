import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { projects: [{ extends: true, test: { include: [`packages/**/*.test.ts`], name: `unit` } }] },
});
