import { Process } from "@snappy/node";
import { join } from "node:path";

import type { Command } from "../Command";

export const BuildSsr: Command = {
  description: `Build site SSR for production.`,
  label: `⚡ SSR`,
  name: `build:ssr`,
  run: async (root, { capture }) => {
    const result = await Process.spawn(
      join(root, `packages`, `site`),
      Process.toolArgv(`bun`, `vite`, [
        `build`,
        `--ssr`,
        `src/entry-server.tsx`,
        `--outDir`,
        join(root, `dist`, `site`, `server`),
      ]),
      capture ? { capture: true } : {},
    );

    return Process.exitCode(result) === 0 ? 0 : result;
  },
};
