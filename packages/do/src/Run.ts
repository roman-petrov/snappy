const DEFAULT_TIMEOUT_MS = 300_000; // 5 min
const OUTPUT_TRUNCATE = 50_000;

type RunResult = { durationMs: number; exitCode: number; stderr: string; stdout: string; timedOut: boolean };

type RunOptions = { stdio?: "inherit" | "pipe"; timeoutMs?: number };

const truncate = (s: string, max: number): { text: string; truncated: boolean } => {
  if (s.length <= max) {
    return { text: s, truncated: false };
  }
  return { text: `${s.slice(0, max)}\n\n[... output truncated ...]`, truncated: true };
};

const run = async (rootDir: string, command: string, options: RunOptions = {}): Promise<RunResult> => {
  const { stdio = "pipe", timeoutMs = DEFAULT_TIMEOUT_MS } = options;
  const start = Date.now();
  const isWin = process.platform === "win32";
  const proc = Bun.spawn(isWin ? ["cmd.exe", "/c", command] : ["sh", "-c", command], {
    cwd: rootDir,
    stderr: stdio === "inherit" ? "inherit" : "pipe",
    stdin: "ignore",
    stdout: stdio === "inherit" ? "inherit" : "pipe",
  });

  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    proc.kill();
  }, timeoutMs);

  const [stdout, stderr] =
    stdio === "pipe"
      ? await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text()])
      : ["", ""];
  clearTimeout(timeout);
  const exitCode = timedOut ? 124 : ((await proc.exited) ?? 1);
  const durationMs = Date.now() - start;

  return { durationMs, exitCode, stderr, stdout, timedOut };
};

const formatResult = (name: string, result: RunResult): string => {
  const { text: so } = truncate(result.stdout, OUTPUT_TRUNCATE);
  const { text: stderrText } = truncate(result.stderr, OUTPUT_TRUNCATE);
  const lines: string[] = [
    `Command: ${name}`,
    `Exit code: ${result.exitCode}`,
    `Duration: ${(result.durationMs / 1000).toFixed(2)}s`,
    ``,
    `--- stdout ---`,
    so,
    ``,
    `--- stderr ---`,
    stderrText,
  ];
  if (result.timedOut) {
    lines.splice(3, 0, `(Timed out.)`, ``);
  }
  return lines.join(`\n`);
};

export const Run = { formatResult, run };
