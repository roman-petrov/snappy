import { ViteConfig } from "@snappy/do/config";
import { join } from "node:path";

const root = join(import.meta.filename, `..`);

export default ViteConfig({
  build: { outDir: `dist`, rollupOptions: { input: [`src/site/index.html`] } },
  resolve: { alias: { "/app": join(root, `src`, `app`) } },
});
