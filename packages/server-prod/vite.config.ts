import { defineConfig } from "vite";

export default defineConfig({
  build: { minify: true, rollupOptions: { output: { entryFileNames: `server.js` } }, ssr: `./src/main.ts` },
  ssr: { noExternal: true },
});
