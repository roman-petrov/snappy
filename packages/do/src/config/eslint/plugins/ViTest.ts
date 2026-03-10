import pluginVitest from "@vitest/eslint-plugin";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: [`**/*.test.ts`, `**/*.test.tsx`],
    plugins: { vitest: pluginVitest },
    rules: {
      ...pluginVitest.configs.all.rules,
      "vitest/max-expects": `off`,
      "vitest/prefer-expect-assertions": `off`,
      "vitest/require-mock-type-parameters": `off`,
    },
  },
]);
