import tsParser from "@typescript-eslint/parser";
import pluginTypeScriptESLint from "@typescript-eslint/eslint-plugin";
import pluginStylistic from "./plugins/Stylistic";
import prettierConfig from "eslint-config-prettier";

export const ESLintConfig = [
  {
    files: [`**/*.ts`],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2022, sourceType: `module`, project: `./tsconfig.json` },
      globals: { console: `readonly`, process: `readonly` },
    },
    plugins: { "@typescript-eslint": pluginTypeScriptESLint },
    rules: {
      ...prettierConfig.rules,
      "prefer-arrow-callback": `error`,
      "func-style": [`error`, `expression`],
      "@typescript-eslint/no-explicit-any": `warn`,
      "@typescript-eslint/explicit-function-return-type": `off`,
      "@typescript-eslint/no-unused-vars": [`error`, { argsIgnorePattern: `^_` }],
      "no-console": `off`,
    },
  },
  ...pluginStylistic,
];
