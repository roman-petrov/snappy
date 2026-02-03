import pluginUnusedImports from "eslint-plugin-unused-imports";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    plugins: { "unused-imports": pluginUnusedImports },
    rules: {
      "unused-imports/no-unused-imports": `error`,
      "unused-imports/no-unused-vars": [
        `error`,
        { args: `after-used`, argsIgnorePattern: `^_`, vars: `all`, varsIgnorePattern: `^_` },
      ],
    },
  },
]);
