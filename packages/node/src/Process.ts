/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable sonarjs/os-command */
import type { ChildProcess } from "node:child_process";
import { spawn as nodeSpawn } from "node:child_process";

export type Runner = `bun` | `npx`;

type SpawnOptions = { env?: Record<string, string>; silent?: boolean; stdio?: `ignore` | `inherit` | `pipe` };

type StdioTuple = [`ignore` | `inherit`, `ignore` | `inherit` | `pipe`, `ignore` | `inherit` | `pipe`];

const stdioInherit: StdioTuple = [`inherit`, `inherit`, `inherit`];
const stdioSilent: StdioTuple = [`inherit`, `ignore`, `ignore`];

const toolArgv = (runner: Runner, tool: string, args: string[]): string[] =>
  runner === `bun` ? [`bun`, `x`, tool, ...args] : [`npx`, tool, ...args];

const toolCommand = (runner: Runner, tool: string, args: string[]): string =>
  runner === `bun` ? `bun x ${tool} ${args.join(` `)}` : `npx ${tool} ${args.join(` `)}`;

const spawnEnv = (options: SpawnOptions): Record<string, string> | undefined =>
  options.env === undefined ? undefined : { ...process.env, ...options.env };

const waitExit = (proc: ChildProcess): Promise<number> =>
  new Promise((resolve, reject) => {
    proc.on(`close`, (code: null | number) => resolve(code ?? 0));
    proc.on(`error`, reject);
  });

const spawn = async (cwd: string, argv: string[], options: SpawnOptions = {}): Promise<number> => {
  const [exe, ...args] = argv;

  const stdio: StdioTuple =
    options.silent === true ? stdioSilent : [stdioInherit[0], options.stdio ?? `inherit`, options.stdio ?? `inherit`];

  const proc = nodeSpawn(exe ?? ``, args, { cwd, env: spawnEnv(options), stdio });

  return waitExit(proc);
};

const spawnShell = async (cwd: string, command: string, options: SpawnOptions = {}): Promise<number> => {
  const stdio: StdioTuple = options.silent === true ? stdioSilent : stdioInherit;

  const proc = nodeSpawn(command, [], { cwd, env: spawnEnv(options), shell: true, stdio });

  return waitExit(proc);
};

export const Process = { spawn, spawnShell, toolArgv, toolCommand };
