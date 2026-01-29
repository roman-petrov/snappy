import pluginCheckFile from "eslint-plugin-check-file";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    plugins: { "check-file": pluginCheckFile },
    rules: { "check-file/folder-naming-convention": [`error`, { "**": `KEBAB_CASE` }] },
  },
]);
