import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { dedupe: [`react`, `react-dom`] },
  test: {
    environment: `jsdom`,
    projects: [{ extends: true, test: { include: [`packages/**/*.test.ts`], name: `unit` } }],
  },
});
