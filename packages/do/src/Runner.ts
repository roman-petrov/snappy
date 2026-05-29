/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable no-await-in-loop */
import { Config } from "@snappy/config";
import { _ } from "@snappy/core";
import { Console, Process, type SpawnResult, Terminal } from "@snappy/node";
import { type ChildProcess, spawn as nodeSpawn } from "node:child_process";
import { join } from "node:path";

import { Build } from "./Build";
import { Commands } from "./Commands";
import { Feature } from "./Feature";

const ok = `✓`;
const fail = `✗`;
const ellipsis = `…`;
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

type ShellResult = number | SpawnResult;

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
    "build:server": Build.server,
    "build:site": Build.site,
    "build:ssr": Build.ssr,
  } as const;

  const rawResult = await (`handler` in run
    ? run.handler === `finish-feature`
      ? Feature.finish(root)
      : buildHandlers[run.handler](root, buildOptions)
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
              if (!verbose && (name === `server:frontend:dev` || name === `server:prod`)) {
                const origin = `https://${Config.host}`;
                Console.log(
                  `\n\n🌐 ${Terminal.yellow(`Site:`)} ${Terminal.blue(origin)}\n💻 ${Terminal.yellow(`App:`)} ${Terminal.blue(`${origin}/app`)}\n`,
                );
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

                return Process.exitCode(shutdownResult);
              }

              return code;
            })()
        : runShell(root, run.command, capture ? { capture: true } : {}));

  const exitCode = Process.exitCode(rawResult);
  const message = _.isObject(rawResult) ? [rawResult.stderr, rawResult.stdout].filter(Boolean).join(`\n`).trim() : ``;

  if (!mcp && !verbose && !(`background` in run && run.background === true)) {
    const seconds = Math.round((_.now() - start) / _.second);
    const statusIcon = exitCode === 0 ? `✅` : `❌`;
    Console.logLine(`${statusIcon} ${Terminal.dim(`${seconds}s`)}`);
  }

  if (!mcp && exitCode !== 0 && _.isObject(rawResult)) {
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
  if (mcp === true && Commands.mcpExcluded(name)) {
    return { exitCode: 1, message: `Command "${name}" is not available via MCP. Run it in the terminal.` };
  }

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
