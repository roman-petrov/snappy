import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import { globalIgnores } from "eslint/config";
import { defineConfig } from "eslint/config";
import globals from "globals";

import plugins from "./plugins";

export const ESLintConfig = defineConfig([
  globalIgnores([`.jscpd`]),
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2025, ...globals.node },
      parser: tsParser,
      parserOptions: { ecmaVersion: 2022, project: `./tsconfig.json`, sourceType: `module` },
    },
    rules: prettierConfig.rules,
  },
  ...plugins,
]);
