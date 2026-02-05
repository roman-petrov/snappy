import { Commands } from "./Commands";

export type ResolveError = { error: string; ok: false };

export type ResolveOk = { command: string; ok: true };

export type ResolveResult = ResolveError | ResolveOk;

const resolve = (root: string, script: string): ResolveResult => {
  const cmd = Commands.commandByName(script);
  if (cmd === undefined) {
    return { error: `Unknown command: ${script}`, ok: false };
  }
  if (cmd.name === `run`) {
    return { command: `__run_all__`, ok: true };
  }
  if (cmd.name === `dev`) {
    return { command: `__dev_all__`, ok: true };
  }
  if (cmd.name === `build`) {
    return { command: `build`, ok: true };
  }

  return { command: cmd.command, ok: true };
};

const formatCommandsHelp = (): string => {
  const padEnd = 14;

  return Commands.commands()
    .map(c => `  ${c.name.padEnd(padEnd)} ${c.description}`)
    .join(`\n`);
};

export const Workflow = { formatCommandsHelp, resolve };
