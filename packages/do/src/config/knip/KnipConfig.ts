import type { KnipConfig } from "knip";

const rootEntry = [
  `cspell.config.js`,
  `eslint.config.js`,
  `prettier.config.js`,
  `stylelint.config.js`,
  `knip.config.ts`,
];

const doIgnoreDeps = [
  `@cspell/dict-ru_ru`,
  `@typescript-eslint/parser`,
  `cspell`,
  `eslint-import-resolver-typescript`,
  `jscpd`,
  `markdownlint-cli`,
  `prettier`,
  `prettier-plugin-pkg`,
  `stylelint-config-recess-order`,
  `stylelint-config-standard`,
  `vitest`,
];

const snappySiteEntry = [
  `Server.ts`,
  `vite.app.config.ts`,
  `src/app/Main.tsx`,
  `src/site/entry-client.tsx`,
  `src/site/entry-server.tsx`,
];

const config: KnipConfig = {
  ignore: [`packages/**/generated/**`],
  ignoreExportsUsedInFile: true,
  ignoreIssues: { "packages/do/src/Instructions.ts": [`exports`] },
  ignoreUnresolved: [`tsx/esm`],
  workspaces: {
    ".": { entry: rootEntry, ignoreDependencies: [`@knip/mcp`], ignoreFiles: [`*.config.js`, `knip.config.ts`] },
    "packages/db": { entry: [`src/Seed.ts`], ignore: [`src/generated/**`], ignoreFiles: [`src/Seed.ts`] },
    "packages/do": { ignoreDependencies: doIgnoreDeps },
    "packages/server": { ignoreDependencies: [`@snappy/config`] },
    "packages/server-prod": { ignoreDependencies: [`express`, `@types/express`] },
    "packages/snappy-site": {
      entry: snappySiteEntry,
      ignoreDependencies: [`@fontsource-variable/inter`],
      ignoreFiles: [`Server.ts`, `vite.app.config.ts`, `vite.app.config.js`, `src/**`],
    },
    "packages/ui": { ignoreDependencies: [`@fontsource-variable/inter`] },
  },
};

export { config as KnipConfig };
