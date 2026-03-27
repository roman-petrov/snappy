/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable no-await-in-loop */
import { _ } from "@snappy/core";
import { Console, Process, Terminal } from "@snappy/node";
import { type ChildProcess, spawn as nodeSpawn } from "node:child_process";
import { join } from "node:path";

import { Build } from "./Build";
import { Commands } from "./Commands";

const ok = `✓`;
const fail = `✗`;
const ellipsis = `\u2026`;
const br = `├`;
const end = `└`;
const bar = `│`;

type RunResult = { exitCode: number; message: string };

type TreeNode = { children: TreeNode[]; name: string };

const tree = (name: string): TreeNode | undefined => {
  const definition = Commands.byName(name);

  return definition === undefined
    ? undefined
    : `run` in definition
      ? { children: [], name }
      : { children: definition.children.map(tree).filter((node): node is TreeNode => node !== undefined), name };
};

type TreeContext = { connector: string; prefix: string };

const treeLine = (prefix: string, connector: string, label: string, status: `fail` | `node` | `ok`) => {
  const icon = status === `ok` ? Terminal.green(ok) : status === `fail` ? Terminal.red(fail) : ``;
  Console.logLine(`${prefix}${connector}─ ${icon ? `${icon} ` : ``}${Terminal.cyan(label)}`);
};

type ShellResult = number | { exitCode: number; stderr: string; stdout: string };

const runShell = async (
  root: string,
  command: string,
  options: { capture?: true; silent?: true },
): Promise<ShellResult> => Process.spawnShell(root, command, options);

type RunLeafOptions = {
  backgroundProcesses: ChildProcess[];
  context: TreeContext;
  mcp: boolean;
  verbose: boolean;
  withoutTree?: boolean;
};

const startupMessage = `\n🌐 ${Terminal.yellow(`Site running at`)} ${Terminal.blue(`https://localhost`)}\n`;

const runLeaf = async (root: string, name: string, options: RunLeafOptions): Promise<RunResult> => {
  const { backgroundProcesses, context, mcp, verbose, withoutTree } = options;
  const definition = Commands.byName(name);
  if (definition === undefined || !(`run` in definition)) {
    return { exitCode: 1, message: `Unknown: ${name}` };
  }

  const { label, run } = definition;
  const capture = !verbose || mcp;

  if (!mcp && !verbose) {
    const prefix = withoutTree === true ? `` : `${context.prefix}${context.connector}─ `;
    Console.log(`${prefix}${Terminal.cyan(label)}${ellipsis} `);
  }

  const start = _.now();
  const buildOptions = capture ? { capture: true as const } : {};

  const buildHandlers = {
    "build:app": Build.app,
    "build:app-android": Build.appAndroid,
    "build:app-android-debug": Build.appAndroidDebug,
    "build:site": Build.site,
    "build:ssr": Build.ssr,
  } as const;

  const rawResult = await (`handler` in run
    ? buildHandlers[run.handler](root, buildOptions)
    : `tool` in run
      ? runShell(root, Process.toolCommand(`bun`, run.tool, run.args), capture ? { capture: true } : {})
      : `command` in run && `cwd` in run
        ? mcp
          ? runShell(join(root, run.cwd), run.command, { capture: true })
          : (async () => {
              const proc = nodeSpawn(run.command, [], {
                cwd: join(root, run.cwd),
                env: run.env === undefined ? process.env : { ...process.env, ...run.env },
                shell: true,
                stdio: `inherit`,
              });
              if (name === `server:prod`) {
                Console.log(`\n${startupMessage}`);
              }

              if (run.background === true) {
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
    const seconds = Math.round((_.now() - start) / _.second);
    const statusIcon = exitCode === 0 ? `✅` : `❌`;
    Console.logLine(`${statusIcon} ${Terminal.dim(`${seconds}s`)}`);
    if (exitCode === 0 && name === `server:frontend:dev`) {
      Console.log(startupMessage);
    }
  }

  if (!mcp && exitCode !== 0 && typeof rawResult === `object`) {
    Console.error(`\n${Terminal.red(`${fail} Error running ${label}`)}\n\n`);
    if (rawResult.stderr.length > 0) {
      Console.error(rawResult.stderr);
    }
    if (rawResult.stdout.length > 0) {
      Console.log(rawResult.stdout);
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
    return runLeaf(root, name, { backgroundProcesses, context, mcp, verbose, withoutTree: isRoot === true });
  }

  const { children, label } = definition;

  if (!mcp && isRoot !== true && !verbose) {
    treeLine(context.prefix, context.connector, label, `node`);
  }

  const childPrefix = context.prefix + (context.connector === end ? `   ` : `${bar}  `);
  const childIndent = isRoot === true ? context.prefix : childPrefix;
  for (const [index, child] of children.entries()) {
    const childConnector = index === children.length - 1 ? end : br;

    const result = await runNode(root, child, {
      backgroundProcesses,
      context: { connector: childConnector, prefix: childIndent },
      mcp,
      verbose,
    });

    if (result.exitCode !== 0) {
      return result;
    }
  }

  return { exitCode: 0, message: `` };
};

const resolveCommand = (name: string): { error: string; ok: false } | { name: string; ok: true } =>
  Commands.byName(name) === undefined ? { error: `Unknown command: ${name}`, ok: false } : { name, ok: true };

const run = async (
  root: string,
  name: string,
  { mcp, verbose: verboseOpt }: { mcp?: boolean; verbose?: boolean } = {},
): Promise<RunResult> => {
  const definition = Commands.byName(name);
  const verbose = verboseOpt ?? (mcp === true || definition?.interactive === true);
  const node = tree(name);
  if (node === undefined) {
    return { exitCode: 1, message: `Unknown command: ${name}` };
  }

  const isMcp = mcp === true;
  const start = _.now();
  const withTree = node.children.length > 0;
  if (!isMcp && !verbose && withTree) {
    Console.log(`\n`);
    if (definition !== undefined) {
      Console.logLine(Terminal.cyan(definition.label));
    }
  }

  const backgroundProcesses: ChildProcess[] = [];

  const result = await runNode(root, name, {
    backgroundProcesses,
    context: { connector: br, prefix: `` },
    isRoot: true,
    mcp,
    verbose,
  });

  if (result.exitCode === 0 && backgroundProcesses.length > 0) {
    await new Promise<void>(resolve => {
      const cleanup = () => {
        for (const proc of backgroundProcesses) {
          proc.kill(`SIGTERM`);
        }
        resolve();
      };
      process.on(`SIGINT`, cleanup);
      process.on(`SIGTERM`, cleanup);
    });
  }

  if (!isMcp && !verbose && result.exitCode !== 0 && result.message.length > 0) {
    Console.error(`\n${Terminal.red(`${fail} ${name} failed`)}\n\n${result.message}\n`);
  }

  if (!isMcp && !verbose && result.exitCode === 0) {
    const seconds = Math.round((_.now() - start) / _.second);
    Console.log(`\n✅ Done in ${Terminal.green(`${seconds}s`)}\n`);
  }

  const message = result.exitCode === 0 && result.message === `` ? `${name} ok.` : result.message;

  return { ...result, message };
};

const formatCommandsHelp = () =>
  Commands.list()
    .map(command => `  ${command.name.padEnd(16)} ${command.description}`)
    .join(`\n`);

export const Runner = { formatCommandsHelp, resolveCommand, run };
