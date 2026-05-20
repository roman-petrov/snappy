/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { register } from "tsx/esm/api";

/**
 * Workaround for tsx: with the root `allowJs: true`, `register()` from `tsx/esm/api` rewrites CJS
 * `require("*.json")` in dependencies (e.g. `globals`, `sass-embedded`) into transpiled JS. Node then
 * tries to parse that output as JSON and fails (`Unexpected token 'v', "var amd=…"`).
 *
 * Incrementing tsx's internal `global-cjs-loader-count` makes the ESM resolve hook treat subsequent
 * `require` calls as already handled by the global CJS loader, so JSON is loaded with Node's native
 * parser again.
 *
 * ? https://github.com/privatenumber/tsx/issues/640 — `allowJs` + wrong resolution for `require('*.json')` (open)
 * ? https://github.com/privatenumber/tsx/issues/645 — same JSON/`require` failure, closed as duplicate of #640
 * ? https://github.com/privatenumber/tsx/blob/master/src/utils/cjs-loader-state.ts — `Symbol.for('tsx:global-cjs-loader-count')`
 * ? https://github.com/privatenumber/tsx/blob/master/src/esm/hook/resolve.ts — skips tsx resolve when count > 0 and `require` context
 * ? https://github.com/privatenumber/tsx/blob/master/src/utils/map-ts-extensions.ts — tries `.json.js` before `.json` when `allowJs` is on
 * ? https://github.com/privatenumber/tsx/blob/master/src/cjs/api/register.ts — full CJS hook via `activateGlobalCjsLoader()` (avoid `--require tsx/cjs` here)
 */
const globalCjsLoaderCount = Symbol.for(`tsx:global-cjs-loader-count`);

const run = async load => {
  globalThis[globalCjsLoaderCount] = (globalThis[globalCjsLoaderCount] ?? 0) + 1;
  const unregister = register();
  const loaded = await load();
  await unregister();

  return loaded;
};

export const Tsx = { import: run };
