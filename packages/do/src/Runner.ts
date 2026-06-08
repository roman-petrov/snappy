/* eslint-disable @typescript-eslint/max-params */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable no-await-in-loop */
/* eslint-disable unicorn/prefer-string-repeat */
import { Config } from "@snappy/config";
import { _ } from "@snappy/core";
import { Console, Process, type SpawnResult, Terminal } from "@snappy/node";
import { type ChildProcess, spawn as nodeSpawn } from "node:child_process";
import { join } from "node:path";

import type { CommandRun } from "./CommandTypes";

import { Build } from "./Build";
import { type CommandName, Commands } from "./Commands";
import { Feature } from "./Feature";
import { DevCert } from "./server-dev";

const ok = `✓`;
const fail = `✗`;
const ellipsis = `…`;
const br = `├`;
const end = `└`;
const bar = `│`;
const devOriginLabelWidth = 6;

const devOriginLine = (emoji: string, name: string, url: string) =>
  `${emoji} ${Terminal.yellow(`${name}:`.padStart(devOriginLabelWidth))} ${Terminal.blue(url)}`;

const showDevOrigins = (name: CommandName) => name === `server:frontend:dev` || name === `server:prod`;

const devOriginsBlock = () => {
  const origin = _.https(Config.host);

  return [
    devOriginLine(`🌐`, `Site`, origin),
    devOriginLine(`💻`, `App`, `${origin}/app`),
    devOriginLine(`🛡️`, `Admin`, `${origin}/admin`),
  ].join(`\n`);
};

const logDevOrigins = () => Console.log(`\n\n${devOriginsBlock()}\n`);

type RunResult = { exitCode: number; message: string };

type TreeNode = { children: TreeNode[]; name: string };

const tree = (name: CommandName): TreeNode => {
  const definition = Commands.byName(name);

  return `run` in definition
    ? { children: [], name }
    : { children: definition.children.filter(Commands.has).map(tree), name };
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

type CwdCommandRun = Extract<CommandRun, { command: string; cwd: string }>;

type RunLeafOptions = {
  backgroundProcesses: ChildProcess[];
  context: TreeContext;
  mcp: boolean;
  verbose: boolean;
  withoutTree?: boolean;
};

const runCwdCommand = async (
  root: string,
  name: CommandName,
  run: CwdCommandRun,
  backgroundProcesses: ChildProcess[],
  mcp: boolean,
  verbose: boolean,
): Promise<number | RunResult | ShellResult> => {
  const background = run.background === true;
  if (mcp && !background) {
    return runShell(join(root, run.cwd), run.command, { capture: true });
  }

  const proc = nodeSpawn(run.command, [], {
    cwd: join(root, run.cwd),
    detached: mcp && background,
    env: run.env === undefined ? process.env : { ...process.env, ...run.env },
    shell: true,
    stdio: mcp && background ? `ignore` : `inherit`,
  });

  if (background && mcp) {
    proc.unref();
    const origins = !verbose && showDevOrigins(name) ? `${devOriginsBlock()}\n\n` : ``;

    return { exitCode: 0, message: `${origins}Started in background.` };
  }
  if (!verbose && showDevOrigins(name)) {
    logDevOrigins();
  }
  if (background) {
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
};

const runLeaf = async (root: string, name: CommandName, options: RunLeafOptions): Promise<RunResult> => {
  const { backgroundProcesses, context, mcp, verbose, withoutTree } = options;
  const definition = Commands.byName(name);
  if (!(`run` in definition)) {
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
    "build:admin": Build.admin,
    "build:app": Build.app,
    "build:app-android": Build.appAndroid,
    "build:app-android-debug": Build.appAndroidDebug,
    "build:server": Build.server,
    "build:site": Build.site,
    "build:ssr": Build.ssr,
    "java-format": Build.javaFormat,
    "java-format-fix": Build.javaFormatFix,
  } as const;

  const rawResult = await (`handler` in run
    ? run.handler === `cert`
      ? DevCert.write(Config.host).then(() => 0)
      : run.handler === `finish-feature`
        ? Feature.finish(root)
        : buildHandlers[run.handler](root, buildOptions)
    : `tool` in run
      ? runShell(root, Process.toolCommand(`bun`, run.tool, run.args), capture ? { capture: true } : {})
      : `command` in run && `cwd` in run
        ? runCwdCommand(root, name, run, backgroundProcesses, mcp, verbose)
        : runShell(root, run.command, capture ? { capture: true } : {}));

  const exitCode = _.isObject(rawResult) ? rawResult.exitCode : rawResult;

  const message =
    _.isObject(rawResult) && `message` in rawResult
      ? rawResult.message
      : _.isObject(rawResult)
        ? [rawResult.stderr, rawResult.stdout].filter(Boolean).join(`\n`).trim()
        : ``;

  if (!mcp && !verbose && !(`background` in run && run.background === true)) {
    const seconds = Math.round((_.now() - start) / _.second);
    const statusIcon = exitCode === 0 ? `✅` : `❌`;
    Console.logLine(`${statusIcon} ${Terminal.dim(`${seconds}s`)}`);
  }

  if (!mcp && exitCode !== 0 && _.isObject(rawResult) && `stderr` in rawResult) {
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

const runNode = async (root: string, name: CommandName, options: RunNodeOptions): Promise<RunResult> => {
  const { backgroundProcesses, context, isRoot, mcp = false, verbose } = options;
  const definition = Commands.byName(name);

  if (`run` in definition) {
    return runLeaf(root, name, { backgroundProcesses, context, mcp, verbose, withoutTree: isRoot === true });
  }

  const { children, label } = definition;

  if (!mcp && isRoot !== true && !verbose) {
    treeLine(context.prefix, context.connector, label, `node`);
  }

  const childPrefix = context.prefix + (context.connector === end ? `   ` : `${bar}  `);
  const childIndent = isRoot === true ? context.prefix : childPrefix;
  const childNames = children.filter(Commands.has);
  for (const [index, child] of childNames.entries()) {
    const childConnector = index === childNames.length - 1 ? end : br;

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

const resolveCommand = (name: string): { error: string; ok: false } | { name: CommandName; ok: true } =>
  Commands.has(name) ? { name, ok: true } : { error: `Unknown command: ${name}`, ok: false };

const run = async (
  root: string,
  name: CommandName,
  { mcp, verbose: verboseOpt }: { mcp?: boolean; verbose?: boolean } = {},
) => {
  const definition = Commands.byName(name);
  const verbose = verboseOpt ?? (mcp === true || definition.interactive === true);
  const node = tree(name);
  const isMcp = mcp === true;
  const start = _.now();
  const withTree = node.children.length > 0;
  if (!isMcp && !verbose && withTree) {
    Console.log(`\n`);
    Console.logLine(Terminal.cyan(definition.label));
  }

  const backgroundProcesses: ChildProcess[] = [];

  const result = await runNode(root, name, {
    backgroundProcesses,
    context: { connector: br, prefix: `` },
    isRoot: true,
    mcp,
    verbose,
  });

  if (result.exitCode === 0 && backgroundProcesses.length > 0 && !isMcp) {
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
