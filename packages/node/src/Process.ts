/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable sonarjs/os-command */
import type { Readable } from "node:stream";

import { type ChildProcess, spawn as nodeSpawn } from "node:child_process";

export type Runner = `bun` | `npx`;

type ProcessEnv = Record<string, string | undefined>;

type SpawnOptions = { capture?: true; env?: ProcessEnv; silent?: boolean; stdio?: `ignore` | `inherit` | `pipe` };

type StdioTuple = [`ignore` | `inherit`, `ignore` | `inherit` | `pipe`, `ignore` | `inherit` | `pipe`];

const stdioInherit: StdioTuple = [`inherit`, `inherit`, `inherit`];
const stdioPipe: StdioTuple = [`ignore`, `pipe`, `pipe`];
const stdioSilent: StdioTuple = [`inherit`, `ignore`, `ignore`];

const toolArgv = (runner: Runner, tool: string, args: string[]): string[] =>
  runner === `bun` ? [`bun`, `x`, tool, ...args] : [`npx`, tool, ...args];

const toolCommand = (runner: Runner, tool: string, args: string[]): string =>
  runner === `bun` ? `bun x ${tool} ${args.join(` `)}` : `npx ${tool} ${args.join(` `)}`;

const spawnEnv = (options: SpawnOptions): ProcessEnv | undefined =>
  options.env === undefined ? undefined : { ...process.env, ...options.env };

const readStream = async (stream: null | Readable): Promise<string> => {
  if (stream === null) {
    return ``;
  }

  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    stream.on(`data`, (chunk: Buffer) => {
      chunks.push(chunk);
    });
    stream.on(`end`, () => {
      resolve(Buffer.concat(chunks).toString(`utf8`));
    });
    stream.on(`error`, reject);
  });
};

const waitExit = async (proc: ChildProcess): Promise<number> =>
  new Promise((resolve, reject) => {
    proc.on(`close`, (code: null | number) => resolve(code ?? 0));
    proc.on(`error`, reject);
  });

type SpawnResult = { exitCode: number; stderr: string; stdout: string };

const waitOrCapture = async (proc: ChildProcess, capture: boolean): Promise<number | SpawnResult> => {
  if (capture && proc.stdout !== null && proc.stderr !== null) {
    const [stdout, stderr] = await Promise.all([readStream(proc.stdout), readStream(proc.stderr)]);
    const exitCode = await waitExit(proc);

    return { exitCode, stderr, stdout };
  }

  return waitExit(proc);
};

const spawn = async (cwd: string, argv: string[], options: SpawnOptions = {}): Promise<number | SpawnResult> => {
  const [exe, ...args] = argv;

  const stdio: StdioTuple =
    options.capture === true
      ? stdioPipe
      : options.silent === true
        ? stdioSilent
        : [stdioInherit[0], options.stdio ?? `inherit`, options.stdio ?? `inherit`];

  const proc = nodeSpawn(exe ?? ``, args, { cwd, env: spawnEnv(options), stdio });

  return waitOrCapture(proc, options.capture === true);
};

const spawnShell = async (cwd: string, command: string, options: SpawnOptions = {}): Promise<number | SpawnResult> => {
  const stdio: StdioTuple = options.capture === true ? stdioPipe : options.silent === true ? stdioSilent : stdioInherit;
  const proc = nodeSpawn(command, [], { cwd, env: spawnEnv(options), shell: true, stdio });

  return waitOrCapture(proc, options.capture === true);
};

export const Process = { spawn, spawnShell, toolArgv, toolCommand };
