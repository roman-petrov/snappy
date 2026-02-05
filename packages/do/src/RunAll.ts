/* eslint-disable no-undef */
/* eslint-disable functional/no-expression-statements */
import { join } from "node:path";

import { Build } from "./Build";

const botMainPath = (root: string) => join(root, `packages`, `snappy-bot`, `src`, `main.ts`);
const siteDir = (root: string) => join(root, `packages`, `snappy-site`);
const distBotPath = (root: string) => join(root, `dist`, `bot`, `app.js`);
const distSiteServerPath = (root: string) => join(root, `dist`, `site`, `server.js`);
const spawnOptions = { stderr: `inherit` as const, stdin: `ignore` as const, stdout: `inherit` as const };

const runDev = async (root: string) => {
  const botProc = Bun.spawn([`bun`, `--watch`, `run`, botMainPath(root)], { cwd: root, ...spawnOptions });
  const siteProc = Bun.spawn([`bun`, `run`, `--cwd`, siteDir(root), `dev`], { cwd: root, ...spawnOptions });
  const first = await Promise.race([botProc.exited, siteProc.exited]);
  botProc.kill();
  siteProc.kill();

  return first;
};

const runProd = async (root: string) => {
  const buildExit = await Build.build(root);
  if (buildExit !== 0) {
    return buildExit;
  }
  const botProc = Bun.spawn([`node`, distBotPath(root)], { cwd: root, ...spawnOptions });
  const siteProc = Bun.spawn([`node`, distSiteServerPath(root)], { cwd: root, ...spawnOptions });
  const first = await Promise.race([botProc.exited, siteProc.exited]);
  botProc.kill();
  siteProc.kill();

  return first;
};

export const RunAll = { runDev, runProd };
