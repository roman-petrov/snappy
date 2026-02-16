import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: `jsdom`,
    projects: [{ extends: true, test: { include: [`packages/**/*.test.ts`], name: `unit` } }],
  },
});
