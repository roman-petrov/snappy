import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [`packages/**/generated/**`],
  ignoreDependencies: [`@testing-library/react`, `vitest`],
  ignoreExportsUsedInFile: true,
  ignoreIssues: { "**/*.module.scss.d.ts": [`exports`], "**/entry-server.tsx": [`exports`] },
  vitest: { config: [`vitest.config.ts`] },
  workspaces: {
    ".": {
      entry: [`auth.ts`, `cspell.config.js`, `eslint.config.js`, `prettier.config.js`, `stylelint.config.js`],
      ignoreDependencies: [`@knip/mcp`, `actions-up`, `@snappy/coder-cli`, `agent-browser`, `vite`],
    },
    "packages/admin": { entry: [`index.html`], ignoreDependencies: [`@snappy/theme`] },
    "packages/ai-stream": { ignoreDependencies: [`@fontsource/google-sans-code`, `@snappy/theme`] },
    "packages/app": { entry: [`index.html`], ignoreDependencies: [`@snappy/theme`] },
    "packages/app-router": { ignoreDependencies: [`@snappy/theme`] },
    "packages/app-server": { entry: [`src/core/test/**/*.ts`] },
    "packages/coder-chunk": {
      ignoreDependencies: [
        `tree-sitter-css`,
        `tree-sitter-java`,
        `tree-sitter-javascript`,
        `tree-sitter-json`,
        `tree-sitter-typescript`,
      ],
    },
    "packages/do": {
      ignoreDependencies: [
        `@cspell/dict-ru_ru`,
        `@testing-library/dom`,
        `@typescript-eslint/parser`,
        `cspell`,
        `eslint-import-resolver-typescript`,
        `jscpd`,
        `markdownlint-cli`,
        `prettier-plugin-pkg`,
        `stylelint-config-recess-order`,
        `stylelint-config-standard-scss`,
        `stylelint-order`,
        `tsdown`,
      ],
    },
    "packages/do-dev": { entry: [`src/main.ts`] },
    "packages/email": { entry: [`emails/**/*.tsx`], ignoreDependencies: [`@react-email/ui`] },
    "packages/site": { entry: [`index.html`, `src/entry-server.tsx`], ignoreDependencies: [`@snappy/theme`] },
    "packages/theme": { ignoreDependencies: [`@fontsource-variable/inter`] },
  },
};

export { config as KnipConfig };
