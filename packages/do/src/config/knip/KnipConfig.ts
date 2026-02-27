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
    "packages/db": { entry: [`src/Seed.ts`] },
    "packages/do": {
      ignoreDependencies: [
        `@cspell/dict-ru_ru`,
        `@typescript-eslint/parser`,
        `cspell`,
        `eslint-import-resolver-typescript`,
        `jscpd`,
        `markdownlint-cli`,
        `prettier`,
        `prettier-plugin-pkg`,
        `stylelint-config-recess-order`,
        `stylelint-config-standard-scss`,
        `vitest`,
      ],
    },
    "packages/snappy-site": {
      entry: [
        `Server.ts`,
        `vite.app.config.ts`,
        `vite.app.config.js`,
        `src/app/Main.tsx`,
        `src/site/entry-client.tsx`,
        `src/site/entry-server.tsx`,
        `src/site/styles.scss`,
      ],
      ignoreDependencies: [`@fontsource-variable/inter`],
    },
    "packages/ui": { ignoreDependencies: [`@fontsource-variable/inter`] },
  },
};

export { config as KnipConfig };
