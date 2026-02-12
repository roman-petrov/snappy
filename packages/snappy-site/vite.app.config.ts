import { defineConfig } from "vite";

export default defineConfig({
  base: `/app/`,
  build: { emptyOutDir: true, outDir: `dist/app`, rollupOptions: { input: [`src/app/index.html`] } },
});
