import { spawn as nodeSpawn } from "node:child_process";

export type Runner = `bun` | `npx`;

type SpawnOptions = { env?: Record<string, string>; silent?: boolean; stdio?: `inherit` | `pipe` | `ignore` };

const runnerFromEnv = (): Runner => {
  const v = process.env[`PROCESS_RUNNER`];

  if (v === `bun` || v === `npx`) {
    return v;
  }

  return `npx`;
};

type StdioTuple = [`inherit` | `ignore`, `inherit` | `ignore` | `pipe`, `inherit` | `ignore` | `pipe`];

const stdioInherit: StdioTuple = [`inherit`, `inherit`, `inherit`];
const stdioSilent: StdioTuple = [`inherit`, `ignore`, `ignore`];

const runner: Runner = runnerFromEnv();

const toolArgv = (tool: string, args: string[]): string[] =>
  runner === `bun` ? [`bun`, `x`, tool, ...args] : [`npx`, tool, ...args];

const toolCommand = (tool: string, args: string[]): string =>
  runner === `bun` ? `bun x ${tool} ${args.join(` `)}` : `npx ${tool} ${args.join(` `)}`;

const spawn = (cwd: string, argv: string[], options: SpawnOptions = {}): Promise<number> =>
  new Promise((resolve, reject) => {
    const [exe, ...args] = argv;
    const stdio: StdioTuple =
      options.silent === true ? stdioSilent : [stdioInherit[0], options.stdio ?? `inherit`, options.stdio ?? `inherit`];
    const proc = nodeSpawn(exe ?? ``, args, {
      cwd,
      env: options.env !== undefined ? { ...process.env, ...options.env } : undefined,
      stdio,
    });
    proc.on(`close`, (code: number | null) => resolve(code ?? 0));
    proc.on(`error`, reject);
  });

const spawnShell = (cwd: string, command: string, options: SpawnOptions = {}): Promise<number> =>
  new Promise((resolve, reject) => {
    const stdio: StdioTuple = options.silent === true ? stdioSilent : stdioInherit;
    const proc = nodeSpawn(command, [], {
      cwd,
      shell: true,
      env: options.env !== undefined ? { ...process.env, ...options.env } : undefined,
      stdio,
    });
    proc.on(`close`, (code: number | null) => resolve(code ?? 0));
    proc.on(`error`, reject);
  });

export const Process = { runner, spawn, spawnShell, toolArgv, toolCommand };
