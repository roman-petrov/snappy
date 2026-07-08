/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: `node`,
    pool: `threads`,
    projects: [{ extends: true, test: { include: [`packages/**/*.test.{ts,tsx}`], name: `unit` } }],
  },
});
