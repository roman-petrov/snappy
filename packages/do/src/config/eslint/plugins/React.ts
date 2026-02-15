import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    plugins: { react: pluginReact },
    rules: {
      ...pluginReact.configs.flat[`all`]?.rules,
      ...pluginReact.configs.flat[`jsx-runtime`]?.rules,
      "react/button-has-type": `off`,
      "react/function-component-definition": [
        `error`,
        { namedComponents: `arrow-function`, unnamedComponents: `arrow-function` },
      ],
      "react/jsx-curly-brace-presence": [`error`, { children: `never`, propElementValues: `always`, props: `never` }],
      "react/jsx-filename-extension": [`error`, { extensions: [`.tsx`] }],
      "react/jsx-handler-names": `off`,
      "react/jsx-indent": `off`,
      "react/jsx-indent-props": `off`,
      "react/jsx-key": `off`,
      "react/jsx-max-depth": [`error`, { max: 10 }],
      "react/jsx-max-props-per-line": `off`,
      "react/jsx-newline": `off`,
      "react/jsx-no-bind": [`error`, { allowArrowFunctions: true }],
      "react/jsx-no-literals": `off`,
      "react/jsx-one-expression-per-line": `off`,
      "react/jsx-props-no-spreading": `off`,
      "react/jsx-sort-props": `off`,
      "react/no-children-prop": `off`,
      "react/no-multi-comp": `off`,
      "react/no-unstable-nested-components": [`error`, { allowAsProps: true }],
      "react/no-unused-prop-types": `off`,
      "react/prefer-read-only-props": `off`,
      "react/prop-types": `off`,
      "react/require-default-props": `off`,
      "react/self-closing-comp": `error`,
    },
    settings: { react: { version: `detect` } },
  },
]);
