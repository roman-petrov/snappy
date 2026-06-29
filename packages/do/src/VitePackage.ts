/* eslint-disable functional/no-expression-statements */
import { Directory, File, Process } from "@snappy/node";
import { join } from "node:path";

import type { CommandRun } from "./Command";

const run =
  (packageName: string): CommandRun =>
  async (root, { capture }) => {
    const cwd = join(root, `packages`, packageName);
    const out = join(root, `dist`, packageName);
    Directory.remove(out);

    const result = await Process.spawn(
      cwd,
      Process.toolArgv(`bun`, `vite`, [`build`, `--outDir`, out]),
      capture ? { capture: true } : {},
    );

    return Process.exitCode(result) === 0
      ? (File.copy(join(root, `packages`, `ui`, `src`, `assets`, `favicon.svg`), join(out, `favicon.svg`)), 0)
      : result;
  };

export const VitePackage = { run };
