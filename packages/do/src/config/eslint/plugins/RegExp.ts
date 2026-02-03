import pluginRegExp from "eslint-plugin-regexp";
import { defineConfig } from "eslint/config";

export default defineConfig([
  pluginRegExp.configs[`flat/all`],
  { rules: { "regexp/require-unicode-sets-regexp": `off` } },
]);
