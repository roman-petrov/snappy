import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig([
  reactHooks.configs.flat.recommended,
  {
    files: [`packages/*/src/**/*.{ts,tsx}`],
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-hooks/refs": `off`,
      "react-hooks/set-state-in-effect": `off`,
    },
  },
]);
