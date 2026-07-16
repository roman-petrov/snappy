/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
import { Config } from "@snappy/config";
import { _ } from "@snappy/core";
import { Console, Process, Terminal } from "@snappy/node";
import { spawn as nodeSpawn } from "node:child_process";
import { join } from "node:path";

import type { CommandRun } from "./Command";

const showDevOrigins = (name: string): boolean => name === `server:frontend:dev` || name === `server:prod:run`;

const devOriginsBlock = (name: string) => {
  const labelWidth = 6;

  const line = (emoji: string, label: string, url: string) =>
    `${emoji} ${Terminal.yellow(`${label}:`.padStart(labelWidth))} ${Terminal.blue(url)}`;

  const origin = _.https(Config.host);

  return [
    line(`🌐`, `Site`, origin),
    line(`💻`, `App`, `${origin}/app`),
    line(`🛡️`, `Admin`, `${origin}/admin`),
    ...(name === `server:frontend:dev` ? [line(`📧`, `Email`, `http://localhost:3000`)] : []),
  ].join(`\n`);
};

const logDevOrigins = (name: string) => Console.log(`\n\n${devOriginsBlock(name)}\n`);
const spawnOptions = (capture: boolean) => (capture ? { capture: true as const } : {});
const fail = (message: string, { red = true }: { red?: boolean } = {}) => ({ exitCode: 1, message, red });

const tool =
  (toolName: string, args: string[]): CommandRun =>
  async (root, { capture }) =>
    Process.spawnShell(root, Process.toolCommand(`bun`, toolName, args), spawnOptions(capture));

const shell =
  (command: string): CommandRun =>
  async (root, { capture }) =>
    Process.spawnShell(root, command, spawnOptions(capture));

type BackgroundConfig = {
  background?: true;
  command: string;
  cwd: string;
  env?: Record<string, string>;
  shutdown?: { command: string };
  silent?: true;
};

const background =
  (config: BackgroundConfig): CommandRun =>
  async (root, { backgroundProcesses, mcp, name, verbose }) => {
    const isBackground = config.background === true;
    if (mcp && !isBackground) {
      return Process.spawnShell(join(root, config.cwd), config.command, { capture: true });
    }

    const proc = nodeSpawn(config.command, [], {
      cwd: join(root, config.cwd),
      detached: mcp && isBackground,
      env: config.env === undefined ? process.env : { ...process.env, ...config.env },
      shell: true,
      stdio: (mcp && isBackground) || config.silent === true ? `ignore` : `inherit`,
    });

    if (isBackground && mcp) {
      proc.unref();
      const origins = !verbose && showDevOrigins(name) ? `${devOriginsBlock(name)}\n\n` : ``;

      return { exitCode: 0, message: `${origins}Started in background.` };
    }
    if (!verbose && showDevOrigins(name)) {
      logDevOrigins(name);
    }
    if (isBackground) {
      backgroundProcesses.push(proc);

      return 0;
    }

    const code = await new Promise<number>(resolve => {
      proc.on(`exit`, (c: null | number) => {
        resolve(c ?? 1);
      });
    });

    for (const child of backgroundProcesses) {
      child.kill(`SIGTERM`);
    }

    if (config.shutdown !== undefined) {
      const shutdownResult = await Process.spawnShell(root, config.shutdown.command, { silent: true });

      return Process.exitCode(shutdownResult);
    }

    return code;
  };

export const Run = { background, fail, shell, tool };
