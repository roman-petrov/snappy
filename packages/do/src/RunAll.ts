/* eslint-disable no-undef */
/* eslint-disable functional/no-expression-statements */
import path from "node:path";

import { Build } from "./Build";

const botMainPath = (root: string): string => path.join(root, `packages`, `snappy-bot`, `src`, `main.ts`);
const siteDir = (root: string): string => path.join(root, `packages`, `snappy-site`);
const distBotPath = (root: string): string => path.join(root, `dist`, `bot`, `snappy-bot.js`);
const distSiteServerPath = (root: string): string => path.join(root, `dist`, `site-server.js`);

const spawnOpts = { stderr: `inherit` as const, stdin: `ignore` as const, stdout: `inherit` as const };

const runDev = async (root: string): Promise<number> => {
  const botProc = Bun.spawn([`bun`, `--watch`, `run`, botMainPath(root)], { cwd: root, ...spawnOpts });
  const siteProc = Bun.spawn([`bun`, `run`, `--cwd`, siteDir(root), `dev`], { cwd: root, ...spawnOpts });
  const first = await Promise.race([botProc.exited, siteProc.exited]);
  botProc.kill();
  siteProc.kill();

  return first;
};

const runProduction = async (root: string): Promise<number> => {
  const buildExit = await Build.build(root);
  if (buildExit !== 0) {
    return buildExit;
  }
  const botProc = Bun.spawn([`node`, distBotPath(root)], { cwd: root, ...spawnOpts });
  const siteProc = Bun.spawn([`node`, distSiteServerPath(root)], { cwd: root, ...spawnOpts });
  const first = await Promise.race([botProc.exited, siteProc.exited]);
  botProc.kill();
  siteProc.kill();

  return first;
};

export const RunAll = { runDev, runProd: runProduction };
