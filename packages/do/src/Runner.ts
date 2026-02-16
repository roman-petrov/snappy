/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable no-await-in-loop */
/* eslint-disable sonarjs/os-command */
import { Process } from "@snappy/node";
import { type ChildProcess, spawn as nodeSpawn } from "node:child_process";
import { join } from "node:path";
import open from "open";

import { Build } from "./Build";
import { Commands } from "./Commands";

const reset = `\u001B[0m`;
const green = `\u001B[32m`;
const red = `\u001B[31m`;
const cyan = `\u001B[36m`;
const yellow = `\u001B[33m`;
const magenta = `\u001B[35m`;
const ok = `✓`;
const fail = `✗`;
const br = `├`;
const end = `└`;
const bar = `│`;

type RunResult = { exitCode: number; message: string };

type TreeNode = { children: TreeNode[]; name: string };

const tree = (name: string): TreeNode | undefined => {
  const definition = Commands.byName(name);
  if (definition === undefined) {
    return undefined;
  }
  if (`run` in definition) {
    return { children: [], name };
  }

  return { children: definition.children.map(tree).filter((node): node is TreeNode => node !== undefined), name };
};

type TreeContext = { connector: string; prefix: string };

const treeLine = (prefix: string, connector: string, label: string, status: `fail` | `node` | `ok`) => {
  const icon =
    status === `ok` ? `${green}${ok}${reset}` : status === `fail` ? `${red}${fail}${reset}` : `${magenta}▸${reset}`;
  process.stdout.write(`${prefix}${connector}─ ${icon} ${cyan}${label}${reset}\n`);
};

type ShellResult = number | { exitCode: number; stderr: string; stdout: string };

const runShell = async (
  root: string,
  command: string,
  options: { capture?: true; silent?: true },
): Promise<ShellResult> => Process.spawnShell(root, command, options);

const runner = `bun` as const;

const spawnProc = (root: string, run: { command: string; cwd: string; env?: Record<string, string> }): ChildProcess =>
  nodeSpawn(run.command, [], {
    cwd: join(root, run.cwd),
    env: run.env === undefined ? process.env : { ...process.env, ...run.env },
    shell: true,
    stdio: `inherit`,
  });

const killBackground = (processes: ChildProcess[]): void => {
  for (const proc of processes) {
    proc.kill(`SIGTERM`);
  }
};

type RunLeafOptions = {
  backgroundProcesses: ChildProcess[];
  context: TreeContext;
  mcp: boolean;
  verbose: boolean;
};

const runLeaf = async (root: string, name: string, options: RunLeafOptions): Promise<RunResult> => {
  const { backgroundProcesses, context, mcp, verbose } = options;
  const definition = Commands.byName(name);
  if (definition === undefined || !(`run` in definition)) {
    return { exitCode: 1, message: `Unknown: ${name}` };
  }

  const { label, run } = definition;
  const capture = !verbose || mcp;

  const rawResult = await (`handler` in run
    ? Build.build(root, capture ? { capture: true } : {})
    : `tool` in run
      ? runShell(root, Process.toolCommand(runner, run.tool, run.args), capture ? { capture: true } : {})
      : `command` in run && `cwd` in run
        ? mcp
          ? runShell(join(root, run.cwd), run.command, { capture: true })
          : (async () => {
              const proc = spawnProc(root, run);

              if (run.background === true) {
                backgroundProcesses.push(proc);

                return 0;
              }

              if (run.openUrl !== undefined) {
                open(run.openUrl).catch(() => undefined);
              }

              const code = await new Promise<number>(resolve => {
                proc.on(`exit`, (c: null | number) => {
                  resolve(c ?? 1);
                });
              });
              killBackground(backgroundProcesses);

              if (run.shutdown !== undefined) {
                const shutdownResult = await runShell(root, run.shutdown.command, { silent: true });

                return typeof shutdownResult === `object` ? shutdownResult.exitCode : shutdownResult;
              }

              return code;
            })()
        : runShell(root, run.command, capture ? { capture: true } : {}));

  const exitCode = typeof rawResult === `object` ? rawResult.exitCode : rawResult;

  const message =
    typeof rawResult === `object` ? [rawResult.stderr, rawResult.stdout].filter(Boolean).join(`\n`).trim() : ``;

  if (!mcp && !verbose) {
    treeLine(context.prefix, context.connector, label, exitCode === 0 ? `ok` : `fail`);
  }

  if (!mcp && exitCode !== 0 && typeof rawResult === `object`) {
    process.stderr.write(`\n${red}${fail} Error running ${label}${reset}\n\n`);
    if (rawResult.stderr.length > 0) {
      process.stderr.write(rawResult.stderr);
    }
    if (rawResult.stdout.length > 0) {
      process.stdout.write(rawResult.stdout);
    }
  }

  return { exitCode, message };
};

type RunNodeOptions = {
  backgroundProcesses: ChildProcess[];
  context: TreeContext;
  isRoot?: boolean;
  mcp?: boolean;
  verbose: boolean;
};

const runNode = async (root: string, name: string, options: RunNodeOptions): Promise<RunResult> => {
  const { backgroundProcesses, context, isRoot, mcp = false, verbose } = options;
  const definition = Commands.byName(name);
  if (definition === undefined) {
    return { exitCode: 1, message: `Unknown: ${name}` };
  }

  if (`run` in definition) {
    return runLeaf(root, name, { backgroundProcesses, context, mcp, verbose });
  }

  const { children, label } = definition;

  if (!mcp && isRoot !== true && !verbose) {
    treeLine(context.prefix, context.connector, label, `node`);
  }

  const childPrefix = context.prefix + (context.connector === end ? `   ` : `${bar}  `);

  for (const [index, child] of children.entries()) {
    const childConnector = index === children.length - 1 ? end : br;

    const result = await runNode(root, child, {
      backgroundProcesses,
      context: { connector: childConnector, prefix: childPrefix },
      mcp,
      verbose,
    });

    if (result.exitCode !== 0) {
      return result;
    }
  }

  return { exitCode: 0, message: `` };
};

const resolve = (name: string): { error: string; ok: false } | { name: string; ok: true } =>
  Commands.byName(name) === undefined ? { error: `Unknown command: ${name}`, ok: false } : { name, ok: true };

const run = async (
  root: string,
  name: string,
  options: { mcp?: boolean; verbose?: boolean } = {},
): Promise<RunResult> => {
  const definition = Commands.byName(name);
  const verbose = options.verbose ?? (options.mcp === true || definition?.interactive === true);
  const node = tree(name);
  if (node === undefined) {
    return { exitCode: 1, message: `Unknown command: ${name}` };
  }

  const isMcp = options.mcp === true;
  if (!isMcp && !verbose) {
    process.stdout.write(`\n`);
    if (node.children.length > 0 && definition !== undefined) {
      process.stdout.write(` ${yellow}${br}${reset}─ ${cyan}${definition.label}${reset}\n`);
    }
  }

  const result = await runNode(root, name, {
    backgroundProcesses: [],
    context: { connector: br, prefix: ` ` },
    isRoot: true,
    mcp: options.mcp,
    verbose,
  });

  if (!isMcp && !verbose && result.exitCode !== 0 && result.message.length > 0) {
    process.stderr.write(`\n${red}${fail} ${name} failed${reset}\n\n${result.message}\n`);
  }

  const message = result.exitCode === 0 && result.message === `` ? `${name} ok.` : result.message;

  return { ...result, message };
};

const formatCommandsHelp = (): string =>
  Commands.list()
    .map(command => `  ${command.name.padEnd(16)} ${command.description}`)
    .join(`\n`);

export const Runner = { formatCommandsHelp, resolve, run };
