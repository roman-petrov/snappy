/* eslint-disable functional/no-expression-statements */
import { Process } from "@snappy/node";
import fs from "node:fs";
import { join } from "node:path";

import type { CommandRun } from "./Command";

const run =
  (packageName: string): CommandRun =>
  async (root, { capture }) => {
    const cwd = join(root, `packages`, packageName);
    const out = join(root, `dist`, packageName);
    fs.rmSync(out, { force: true, recursive: true });

    const result = await Process.spawn(
      cwd,
      Process.toolArgv(`bun`, `vite`, [`build`, `--outDir`, out]),
      capture ? { capture: true } : {},
    );
    if (Process.exitCode(result) !== 0) {
      return result;
    }

    const favicon = join(root, `packages`, `ui`, `src`, `assets`, `favicon.svg`);
    if (fs.existsSync(favicon)) {
      fs.copyFileSync(favicon, join(out, `favicon.svg`));
    }

    return 0;
  };

export const VitePackage = { run };
