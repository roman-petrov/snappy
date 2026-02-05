/* eslint-disable no-undef */
/* eslint-disable functional/no-expression-statements */
import { join } from "node:path";

import { Build } from "./Build";

const botMainPath = (root: string) => join(root, `packages`, `snappy-bot`, `src`, `main.ts`);
const siteDir = (root: string) => join(root, `packages`, `snappy-site`);
const distBotPath = (root: string) => join(root, `dist`, `bot`, `app.js`);
const distSiteServerPath = (root: string) => join(root, `dist`, `site`, `server.js`);
const spawnOptions = { stderr: `inherit` as const, stdin: `ignore` as const, stdout: `inherit` as const };

const spawnTwo = async (root: string, botCmd: string[], siteCmd: string[]) => {
  const a = Bun.spawn(botCmd, { cwd: root, ...spawnOptions });
  const b = Bun.spawn(siteCmd, { cwd: root, ...spawnOptions });
  const exit = await Promise.race([a.exited, b.exited]);

  a.kill();
  b.kill();

  return exit;
};

const runDev = async (root: string) =>
  spawnTwo(root, [`bun`, `--watch`, `run`, botMainPath(root)], [`bun`, `run`, `--cwd`, siteDir(root), `dev`]);

const runProd = async (root: string) => {
  const buildExit = await Build.build(root);
  if (buildExit !== 0) {
    return buildExit;
  }

  return spawnTwo(root, [`node`, distBotPath(root)], [`node`, distSiteServerPath(root)]);
};

export const RunAll = { runDev, runProd };
