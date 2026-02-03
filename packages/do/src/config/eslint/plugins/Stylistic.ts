import pluginStylistic from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";

export default defineConfig([
  pluginStylistic.configs[`disable-legacy`],
  {
    plugins: { "@stylistic": pluginStylistic },
    rules: {
      "@stylistic/jsx-curly-brace-presence": [
        `error`,
        { children: `never`, propElementValues: `always`, props: `never` },
      ],
      "@stylistic/jsx-self-closing-comp": `error`,
      "@stylistic/multiline-comment-style": [`error`, `bare-block`],
      "@stylistic/padding-line-between-statements": [
        `error`,
        // Return statements
        { blankLine: `always`, next: `return`, prev: `*` },
        // Variable declarations
        {
          blankLine: `never`,
          next: [`singleline-const`, `singleline-let`],
          prev: [`singleline-const`, `singleline-let`],
        },
        { blankLine: `always`, next: [`multiline-const`, `multiline-let`], prev: [`multiline-const`, `multiline-let`] },
        {
          blankLine: `always`,
          next: [`singleline-const`, `singleline-let`],
          prev: [`multiline-const`, `multiline-let`],
        },
        {
          blankLine: `always`,
          next: [`multiline-const`, `multiline-let`],
          prev: [`singleline-const`, `singleline-let`],
        },
        // Types
        { blankLine: `always`, next: [`*`], prev: [`type`, `interface`] },
        { blankLine: `always`, next: [`type`, `interface`], prev: [`*`] },
        // Imports/exports:
        { blankLine: `always`, next: [`export`], prev: [`*`] },
        { blankLine: `always`, next: [`export`, `const`, `let`], prev: [`import`] },
      ],
      "@stylistic/quotes": [`error`, `backtick`],
    },
  },
]);
