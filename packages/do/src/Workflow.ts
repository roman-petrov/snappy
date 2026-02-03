import fs from "node:fs";
import path from "node:path";

import { Commands } from "./Commands";

export type ResolveError = { error: string; ok: false };

export type ResolveOk = { command: string; ok: true };

export type ResolveResult = ResolveError | ResolveOk;

const applicationPackages = (root: string): string[] => {
  const packagesDir = path.join(root, `packages`);

  if (!fs.existsSync(packagesDir)) {
    return [];
  }

  return fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((ent): ent is fs.Dirent => ent.isDirectory())
    .map(ent => ent.name)
    .filter(name => fs.existsSync(path.join(packagesDir, name, `src`, `main.ts`)));
};

const resolve = (root: string, script: string, packageArg: string | undefined): ResolveResult => {
  const cmd = Commands.commandByName(script);
  if (cmd === undefined) {
    return { error: `Unknown command: ${script}`, ok: false };
  }
  if (cmd.name !== `run` && cmd.name !== `dev`) {
    return { command: cmd.command, ok: true };
  }
  if (packageArg === undefined || packageArg === ``) {
    return { error: `For "${script}" pass package (e.g. snappy-bot).`, ok: false };
  }
  const scriptPath = path.join(root, `packages`, packageArg, `src`, `main.ts`);
  if (!fs.existsSync(scriptPath)) {
    return { error: `Package is not an application.`, ok: false };
  }

  const command = cmd.name === `dev` ? `bun --watch run ${scriptPath}` : `bun run ${scriptPath}`;

  return { command, ok: true };
};

const formatCommandsHelp = (): string => {
  const padEnd = 14;

  return Commands.commands()
    .map(c => `  ${c.name.padEnd(padEnd)} ${c.description}`)
    .join(`\n`);
};

export const Workflow = { applicationPackages, formatCommandsHelp, resolve };
