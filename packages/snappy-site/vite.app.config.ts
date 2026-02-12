import { defineConfig } from "vite";

export default defineConfig({
  base: `/app/`,
  root: `src/app`,
  build: { emptyOutDir: true, outDir: `../../dist/app`, rollupOptions: { input: [`index.html`] } },
});
