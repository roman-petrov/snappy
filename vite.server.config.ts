import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: true,
    outDir: `dist`,
    rollupOptions: { output: { entryFileNames: `server.js` } },
    ssr: `packages/server-prod/src/main.ts`,
  },
  ssr: { noExternal: true },
});
