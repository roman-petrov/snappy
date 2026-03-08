import pluginImport from "eslint-plugin-import";
import { defineConfig } from "eslint/config";

const preactPackages = [
  `**/packages/app/**`,
  `**/packages/app-desktop/**`,
  `**/packages/app-mobile/**`,
  `**/packages/site/**`,
  `**/packages/store/**`,
  `**/packages/ui/**`,
];

export default defineConfig([
  {
    files: [`**/*.{ts,tsx,js}`],
    plugins: { import: pluginImport },
    rules: {
      ...pluginImport.flatConfigs.recommended.rules,
      "import/default": `off`,
      "import/named": `off`,
      "import/namespace": `off`,
      "import/no-extraneous-dependencies": [
        `error`,
        {
          devDependencies: [`packages/**`, `**/*.test.ts`, `**/*.config.*`],
          includeInternal: true,
          includeTypes: true,
        },
      ],
      "import/no-named-as-default": `off`,
      "import/no-named-as-default-member": `off`,
      "import/no-unresolved": `off`,
      "import/order": `off`,
    },
    settings: { "import/resolver": { node: true, typescript: true } },
  },
  { files: preactPackages, settings: { "import/core-modules": [`react`, `react-dom`, `react-dom/client`] } },
]);
