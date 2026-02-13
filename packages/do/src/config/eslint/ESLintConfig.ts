/* eslint-disable unicorn/filename-case */
import prettierConfig from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

import plugins from "./plugins/index";

export const ESLintConfig = defineConfig([
  globalIgnores([`.jscpd`, `**/dist/**`, `**/*.css`, `**/*.html`, `**/packages/*/src/generated/**`]),
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2025, ...globals.node },
      parserOptions: {
        projectService: { allowDefaultProject: [`packages/*/vite.config.js`, `packages/*/vite.app.config.js`] },
      },
    },
    rules: prettierConfig.rules,
  },
  ...plugins,
]);
