/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable sonarjs/os-command */
import type { Readable } from "node:stream";

import { spawn } from "node:child_process";

const msPerSecond = 1000;

type RunOptions = { stdio?: `inherit` | `pipe` };

type RunResult = { durationMs: number; exitCode: number; stderr: string; stdout: string };

const readStream = async (stream: null | Readable): Promise<string> => {
  if (stream === null) {
    return ``;
  }
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    stream.on(`data`, (chunk: Buffer) => {
      chunks.push(chunk);
    });
    stream.on(`end`, () => resolve(Buffer.concat(chunks).toString(`utf8`)));
    stream.on(`error`, (error: Error) => {
      reject(error);
    });
  });
};

const run = async (rootDir: string, command: string, options: RunOptions = {}): Promise<RunResult> => {
  const { stdio = `pipe` } = options;
  const start = Date.now();

  const proc = spawn(command, [], {
    cwd: rootDir,
    shell: true,
    stdio: stdio === `inherit` ? `inherit` : [`ignore`, `pipe`, `pipe`],
  });

  const [stdout, stderr] =
    stdio === `pipe` && proc.stdout !== null && proc.stderr !== null
      ? await Promise.all([readStream(proc.stdout), readStream(proc.stderr)])
      : [``, ``];

  const exitCode = await new Promise<number>(resolve => {
    proc.on(`close`, code => resolve(code ?? 1));
  });

  const durationMs = Date.now() - start;

  return { durationMs, exitCode, stderr, stdout };
};

const formatResult = (name: string, result: RunResult): string =>
  [
    `Command: ${name}`,
    `Exit code: ${result.exitCode}`,
    `Duration: ${(result.durationMs / msPerSecond).toFixed(2)}s`,
    ``,
    `--- stdout ---`,
    result.stdout,
    ``,
    `--- stderr ---`,
    result.stderr,
  ].join(`\n`);

export const Run = { formatResult, run };
