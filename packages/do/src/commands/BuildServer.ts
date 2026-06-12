/* eslint-disable functional/no-expression-statements */
import { Process } from "@snappy/node";
import fs from "node:fs";
import { join } from "node:path";

import type { Command } from "../Command";

export const BuildServer: Command = {
  description: `Build API server for production.`,
  label: `🏭 Server`,
  name: `build:server`,
  run: async (root, { capture }) => {
    const cwd = join(root, `packages`, `server`);
    const out = join(root, `dist`, `server`);
    fs.rmSync(out, { force: true, recursive: true });

    const result = await Process.spawn(
      cwd,
      Process.toolArgv(`bun`, `tsdown`, [`--out-dir`, out]),
      capture ? { capture: true } : {},
    );

    return Process.exitCode(result) === 0 ? 0 : result;
  },
};
