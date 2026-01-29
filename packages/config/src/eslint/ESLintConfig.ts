import pluginTypeScriptESLint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import { globalIgnores } from "eslint/config";

import plugins from "./plugins";

export const ESLintConfig = [
  globalIgnores([`.jscpd`]),
  {
    files: [`**/*.ts`],
    languageOptions: {
      globals: { console: `readonly`, process: `readonly` },
      parser: tsParser,
      parserOptions: { ecmaVersion: 2022, project: `./tsconfig.json`, sourceType: `module` },
    },
    plugins: { "@typescript-eslint": pluginTypeScriptESLint },
    rules: {
      ...prettierConfig.rules,
      "@typescript-eslint/explicit-function-return-type": `off`,
      "@typescript-eslint/no-explicit-any": `warn`,
      "@typescript-eslint/no-unused-vars": [`error`, { argsIgnorePattern: `^_` }],
      "func-style": [`error`, `expression`],
      "no-console": `off`,
      "prefer-arrow-callback": `error`,
    },
  },
  ...plugins,
];
