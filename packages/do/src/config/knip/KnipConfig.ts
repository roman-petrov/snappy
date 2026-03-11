import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [`packages/**/generated/**`],
  ignoreExportsUsedInFile: true,
  ignoreIssues: {
    "**/*.module.scss.d.ts": [`exports`],
    "**/entry-server.tsx": [`exports`],
    "packages/do/src/config/index.esm.js": [`exports`],
  },
  ignoreUnresolved: [`tsx/esm`],
  workspaces: {
    ".": {
      entry: [`cspell.config.js`, `eslint.config.js`, `prettier.config.js`, `stylelint.config.js`, `knip.config.ts`],
      ignoreDependencies: [`@knip/mcp`, `jsdom`, `actions-up`],
    },
    "packages/app": { ignoreDependencies: [`@snappy/do`] },
    "packages/app-desktop": { entry: [`index.html`], ignoreDependencies: [`preact`] },
    "packages/app-mobile": { entry: [`index.html`] },
    "packages/db": { entry: [`src/Seed.ts`] },
    "packages/do": {
      entry: [`src/main.*.ts`],
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
    "packages/site": { entry: [`index.html`, `src/entry-server.tsx`], ignoreDependencies: [`@types/react-dom`] },
    "packages/ui": { ignoreDependencies: [`@fontsource-variable/inter`] },
  },
};

export { config as KnipConfig };
