import pluginFunctional from "eslint-plugin-functional";

/**
 * TODO(code-quality):
 * Need to revisit this configuration if https://github.com/microsoft/TypeScript/issues/42357 is shipped in TypeScript
 */
export default [
  pluginFunctional.configs.all,
  {
    rules: {
      "functional/functional-parameters": `off`,
      "functional/no-conditional-statements": `off`,
      "functional/no-mixed-types": `off`,
      "functional/no-return-void": `off`,
      "functional/no-throw-statements": `off`,
      "functional/prefer-immutable-types": `off`,
      "functional/readonly-type": `off`,
      "functional/type-declaration-immutability": `off`,
    },
  },
  { files: [`packages/*/src/main.ts`], rules: { "functional/no-expression-statements": `off` } },
];
