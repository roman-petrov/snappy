import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "tsdown";

export default defineConfig({
  banner: { js: `import { createRequire } from "node:module";const require=createRequire(import.meta.url);` },
  deps: { alwaysBundle: [/^@snappy\//u], neverBundle: true },
  // eslint-disable-next-line @stylistic/quotes --- IMPORTANT: Knip will not work with backticks!
  entry: { main: "./src/main.ts" },
  format: `esm`,
  minify: false,
  outExtensions: () => ({ js: `.js` }),
  sourcemap: true,
  target: `node${readFileSync(join(import.meta.dirname, `../..`, `.node-version`), `utf8`).trim()}`,
});
