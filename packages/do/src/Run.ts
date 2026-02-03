/* eslint-disable no-undef */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
const defaultTimeoutMs = 300_000;
const outputTruncate = 50_000;

type RunOptions = { stdio?: `inherit` | `pipe`; timeoutMs?: number };

type RunResult = { durationMs: number; exitCode: number; stderr: string; stdout: string; timedOut: boolean };

const truncate = (s: string, max: number): { text: string; truncated: boolean } => {
  if (s.length <= max) {
    return { text: s, truncated: false };
  }

  return { text: `${s.slice(0, max)}\n\n[... output truncated ...]`, truncated: true };
};

const exitCodeTimeout = 124;
const msPerSecond = 1000;
const timedOutInsertIndex = 3;

const run = async (rootDir: string, command: string, options: RunOptions = {}): Promise<RunResult> => {
  const { stdio = `pipe`, timeoutMs = defaultTimeoutMs } = options;
  const start = Date.now();
  const isWin = process.platform === `win32`;

  const proc = Bun.spawn(isWin ? [`cmd.exe`, `/c`, command] : [`sh`, `-c`, command], {
    cwd: rootDir,
    stderr: stdio === `inherit` ? `inherit` : `pipe`,
    stdin: `ignore`,
    stdout: stdio === `inherit` ? `inherit` : `pipe`,
  });

  const timedOutRef = { current: false };

  const timeout = setTimeout(() => {
    timedOutRef.current = true;
    proc.kill();
  }, timeoutMs);

  const [stdout, stderr] =
    stdio === `pipe`
      ? await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text()])
      : [``, ``];
  clearTimeout(timeout);
  const exited = await proc.exited;
  const exitCode = timedOutRef.current ? exitCodeTimeout : (exited ?? 1);
  const durationMs = Date.now() - start;

  return { durationMs, exitCode, stderr, stdout, timedOut: timedOutRef.current };
};

const formatResult = (name: string, result: RunResult): string => {
  const { text: so } = truncate(result.stdout, outputTruncate);
  const { text: stderrText } = truncate(result.stderr, outputTruncate);

  const baseLines: string[] = [
    `Command: ${name}`,
    `Exit code: ${result.exitCode}`,
    `Duration: ${(result.durationMs / msPerSecond).toFixed(2)}s`,
    ``,
    `--- stdout ---`,
    so,
    ``,
    `--- stderr ---`,
    stderrText,
  ];

  const lines = result.timedOut
    ? [...baseLines.slice(0, timedOutInsertIndex), `(Timed out.)`, ``, ...baseLines.slice(timedOutInsertIndex)]
    : baseLines;

  return lines.join(`\n`);
};

export const Run = { formatResult, run };
