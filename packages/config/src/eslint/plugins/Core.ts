import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.all,
  {
    rules: {
      "arrow-parens": [`error`, `as-needed`],
      "camelcase": `off`,
      "capitalized-comments": [`error`, `always`, { ignorePattern: `jscpd|cspell` }],
      "complexity": `off`,
      "curly": [`error`, `all`],
      "id-length": [`error`, { exceptions: [`_`, `$`, `a`, `b`, `c`, `x`, `y`, `z`, `r`, `h`, `s`, `v`, `t`] }],
      "max-lines": `off`,
      "max-lines-per-function": `off`,
      "max-params": [`error`, { max: 10 }],
      "max-statements": `off`,
      "new-cap": `off`,
      "no-magic-numbers": `off`,
      "no-plus-plus": `off`,
      "no-redeclare": `off`,
      "no-ternary": `off`,
      "no-undefined": `off`,
      "no-void": [`error`, { allowAsStatement: true }],
      "no-warning-comments": `off`,
      "one-var": [`error`, `never`],
      "sort-imports": `off`,
      "sort-keys": `off`,
      "spaced-comment": `off`,
    },
  },
]);
