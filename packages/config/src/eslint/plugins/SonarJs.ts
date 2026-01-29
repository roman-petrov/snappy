import pluginSonarJs from "eslint-plugin-sonarjs";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // @ts-expect-error - pluginSonarJs.configs.recommended is not assignable to type 'InfiniteArray<ConfigWithExtends>'.
  pluginSonarJs.configs.recommended,
  {
    rules: {
      "sonarjs/alt-text": `off`,
      "sonarjs/cognitive-complexity": `off`,
      "sonarjs/cyclomatic-complexity": `off`,
      "sonarjs/function-return-type": `off`,
      "sonarjs/hook-use-state": `off`,
      "sonarjs/jsx-key": `off`,
      "sonarjs/mouse-events-a11y": `off`,
      "sonarjs/new-cap": `off`,
      "sonarjs/no-empty-test-file": `off`,
      "sonarjs/no-globals-shadowing": `off`,
      "sonarjs/no-invalid-await": `off`,
      "sonarjs/no-misused-promises": `off`,
      "sonarjs/no-nested-conditional": `off`,
      "sonarjs/no-nested-functions": `off`,
      "sonarjs/no-nested-template-literals": `off`,
      "sonarjs/no-redeclare": `off`,
      "sonarjs/no-unstable-nested-components": `off`,
      "sonarjs/sonar-no-unused-vars": `off`,
      "sonarjs/todo-tag": `off`,
    },
  },
]);
