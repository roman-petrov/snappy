import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = join(fileURLToPath(import.meta.url), `..`);

export default defineConfig({
  build: { outDir: `dist`, rollupOptions: { input: [`src/site/index.html`] } },
  resolve: { alias: { "/app": join(root, `src`, `app`) } },
});
