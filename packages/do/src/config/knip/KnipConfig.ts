import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [`packages/**/generated/**`],
  ignoreExportsUsedInFile: true,
  ignoreIssues: {
    "**/*.module.scss.d.ts": [`exports`],
    "**/entry-server.tsx": [`exports`],
    "packages/do/src/config/index.esm.js": [`exports`],
  },
  workspaces: {
    ".": {
      entry: [`cspell.config.js`, `eslint.config.js`, `prettier.config.js`, `stylelint.config.js`],
      ignoreDependencies: [`@knip/mcp`, `jsdom`, `actions-up`],
    },
    "packages/app": { entry: [`index.html`], ignoreDependencies: [`@snappy/theme`] },
    "packages/do": {
      entry: [`src/main.*.ts`, `src/NodeLoader.js`],
      ignoreDependencies: [
        `@cspell/dict-ru_ru`,
        `@typescript-eslint/parser`,
        `cspell`,
        `eslint-import-resolver-typescript`,
        `jscpd`,
        `markdownlint-cli`,
        `prettier-plugin-pkg`,
        `stylelint-config-recess-order`,
        `stylelint-config-standard-scss`,
      ],
    },
    "packages/site": { entry: [`index.html`, `src/entry-server.tsx`], ignoreDependencies: [`@snappy/theme`] },
    "packages/theme": { ignoreDependencies: [`@fontsource-variable/inter`] },
  },
};

export { config as KnipConfig };
