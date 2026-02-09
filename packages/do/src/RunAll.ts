/* eslint-disable functional/no-expression-statements */
/* eslint-disable no-undef */
import { join } from "node:path";
import open from "open";

import { Build } from "./Build";

const siteDir = (root: string) => join(root, `packages`, `snappy-site`);
const serverMainPath = (root: string) => join(root, `packages`, `server-dev`, `src`, `main.ts`);
const distServerPath = (root: string) => join(root, `dist`, `server.js`);
const spawnOptions = { stderr: `inherit` as const, stdin: `ignore` as const, stdout: `inherit` as const };
const vitePort = 5173;

const runDev = async (root: string) => {
  Bun.spawn([`bun`, `run`, `dev`], { cwd: siteDir(root), ...spawnOptions });

  const proc = Bun.spawn([`bun`, `--watch`, `run`, serverMainPath(root)], {
    cwd: root,
    env: { ...process.env, NODE_ENV: `development` },
    ...spawnOptions,
  });

  await open(`http://localhost:${vitePort}`);

  return proc.exited;
};

const runProd = async (root: string) => {
  const buildExit = await Build.build(root);
  if (buildExit !== 0) {
    return buildExit;
  }

  const proc = Bun.spawn([`node`, distServerPath(root)], { cwd: root, ...spawnOptions });

  return proc.exited;
};

export const RunAll = { runDev, runProd };
