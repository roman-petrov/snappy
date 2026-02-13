// cspell:word lightningcss
import { defineConfig } from "vite";
import typedCssModules from "vite-plugin-typed-css-modules";

import { cssModulesCamelCasePlugin } from "./vite.css-modules";

export default defineConfig({
  base: `/app/`,
  build: { emptyOutDir: true, outDir: `../../dist/app`, rollupOptions: { input: [`index.html`] } },
  css: { lightningcss: { cssModules: true }, transformer: `lightningcss` },
  plugins: [typedCssModules(), cssModulesCamelCasePlugin()],
  root: `src/app`,
});
