/* eslint-disable no-undef */
/* eslint-disable functional/no-expression-statements */
import path from "node:path";

import { Build } from "./Build";

const botMainPath = (root: string): string => path.join(root, `packages`, `snappy-bot`, `src`, `main.ts`);
const siteDir = (root: string): string => path.join(root, `packages`, `snappy-site`);
const distBotPath = (root: string): string => path.join(root, `dist`, `bot`, `snappy-bot.js`);
const distSiteServerPath = (root: string): string => path.join(root, `dist`, `site-server.js`);
const isWin = process.platform === `win32`;

const spawnInherit = (root: string, command: string): ReturnType<typeof Bun.spawn> =>
  Bun.spawn(isWin ? [`cmd.exe`, `/c`, command] : [`sh`, `-c`, command], {
    cwd: root,
    stderr: `inherit`,
    stdin: `inherit`,
    stdout: `inherit`,
  });

const runDev = async (root: string): Promise<number> => {
  const botCmd = `bun --watch run "${botMainPath(root)}"`;
  const siteCmd = `bun run --cwd "${siteDir(root)}" dev`;
  const botProc = spawnInherit(root, botCmd);
  const siteProc = spawnInherit(root, siteCmd);
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
  const botProc = spawnInherit(root, `node "${distBotPath(root)}"`);
  const siteProc = spawnInherit(root, `node "${distSiteServerPath(root)}"`);
  const first = await Promise.race([botProc.exited, siteProc.exited]);
  botProc.kill();
  siteProc.kill();

  return first;
};

export const RunAll = { runDev, runProd: runProduction };
