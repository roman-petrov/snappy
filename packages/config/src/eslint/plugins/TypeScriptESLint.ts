import { defineConfig } from "eslint/config";
import pluginTypescriptESLint from "typescript-eslint";

// See https://typescript-eslint.io/troubleshooting/performance-troubleshooting/
export default defineConfig([
  ...pluginTypescriptESLint.configs.all,
  {
    files: [`**/*.{js,ts}`],
    rules: {
      "@typescript-eslint/adjacent-overload-signatures": `off`,
      "@typescript-eslint/consistent-type-definitions": [`error`, `type`],
      "@typescript-eslint/consistent-type-imports": [
        `error`,
        { fixStyle: `inline-type-imports`, prefer: `type-imports` },
      ],
      "@typescript-eslint/explicit-function-return-type": `off`,
      "@typescript-eslint/explicit-module-boundary-types": `off`,
      "@typescript-eslint/init-declarations": `off`,
      "@typescript-eslint/max-params": [`error`, { max: 5 }],
      "@typescript-eslint/member-ordering": `off`,
      "@typescript-eslint/naming-convention": [
        `error`,
        { format: [`camelCase`], leadingUnderscore: `forbid`, selector: [`default`], trailingUnderscore: `forbid` },
        {
          format: [],
          leadingUnderscore: `allow`,
          selector: [`objectLiteralProperty`, `objectLiteralMethod`],
          trailingUnderscore: `allow`,
        },
        { format: [`PascalCase`], leadingUnderscore: `forbid`, selector: [`typeLike`], trailingUnderscore: `forbid` },
        {
          format: [`PascalCase`, `camelCase`],
          leadingUnderscore: `forbid`,
          modifiers: [`exported`],
          selector: [`variableLike`],
          trailingUnderscore: `forbid`,
        },
        { format: [], leadingUnderscore: `allow`, modifiers: [`unused`], selector: [`parameter`] },
      ],
      "@typescript-eslint/no-confusing-void-expression": `off`,
      "@typescript-eslint/no-magic-numbers": [`error`, { ignore: [-1, 0, 1, 2, 4, 8, 16, 24, 32] }],
      "@typescript-eslint/no-redeclare": `off`,
      "@typescript-eslint/no-restricted-types": [
        `error`,
        {
          types: {
            Readonly: `We decided not to enforce immutable types and hope that TypeScript language immutability by default will be shipped some day: https://github.com/microsoft/TypeScript/issues/32758`,
          },
        },
      ],
      "@typescript-eslint/no-type-alias": `off`,
      "@typescript-eslint/no-unnecessary-type-parameters": `off`,
      "@typescript-eslint/no-unused-vars": `off`,
      "@typescript-eslint/prefer-readonly-parameter-types": `off`,
      "@typescript-eslint/require-array-sort-compare": [`error`, { ignoreStringArrays: true }],
      "@typescript-eslint/sort-type-constituents": `off`,
      "@typescript-eslint/strict-boolean-expressions": [
        `error`,
        { allowNullableEnum: false, allowNullableObject: false },
      ],
    },
  },
  { files: [`**/*.js`], rules: pluginTypescriptESLint.configs.disableTypeChecked.rules },
]);
