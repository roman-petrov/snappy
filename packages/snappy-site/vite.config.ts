// cspell:word lightningcss
import { join } from "node:path";
import { defineConfig } from "vite";
import typedCssModules from "vite-plugin-typed-css-modules";

import { cssModulesCamelCasePlugin } from "./vite.css-modules";

const root = join(import.meta.filename, `..`);

export default defineConfig({
  build: { outDir: `dist`, rollupOptions: { input: [`src/site/index.html`] } },
  css: { lightningcss: { cssModules: true }, transformer: `lightningcss` },
  plugins: [
    typedCssModules({ include: [`**/*.module.css`, `../ui/src/**/*.module.css`] }),
    cssModulesCamelCasePlugin(),
  ],
  resolve: { alias: { "/app": join(root, `src`, `app`) } },
});
