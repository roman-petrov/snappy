import { join } from "node:path";
import { defineConfig } from "vite";

const root = join(import.meta.filename, `..`);

export default defineConfig({
  build: { outDir: `dist`, rollupOptions: { input: [`src/site/index.html`] } },
  resolve: { alias: { "/app": join(root, `src`, `app`) } },
});
