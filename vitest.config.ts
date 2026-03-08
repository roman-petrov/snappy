import path from "node:path";
import { defineConfig } from "vitest/config";

const root = import.meta.dirname;
const preactHooksCjs = path.join(root, `node_modules/preact/hooks/dist/hooks.js`);

export default defineConfig({
  resolve: {
    alias: [
      { find: `react`, replacement: `preact/compat` },
      { find: `react-dom`, replacement: `preact/compat` },
      { find: `react-dom/test-utils`, replacement: `preact/test-utils` },
      { find: `preact/hooks`, replacement: preactHooksCjs },
    ],
    dedupe: [`react`, `react-dom`, `preact`],
  },
  test: {
    environment: `jsdom`,
    projects: [{ extends: true, test: { include: [`packages/**/*.test.ts`], name: `unit` } }],
  },
});
