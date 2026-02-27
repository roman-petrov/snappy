import { ViteConfig } from "@snappy/do/config";

export default ViteConfig({
  base: `/app/`,
  build: { emptyOutDir: true, outDir: `../../dist/app`, rollupOptions: { input: [`index.html`] } },
  root: `src/app`,
});
