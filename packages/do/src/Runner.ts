/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable no-await-in-loop */
/* eslint-disable unicorn/prefer-string-repeat */
import type { ChildProcess } from "node:child_process";

import { _ } from "@snappy/core";
import { Console, Terminal } from "@snappy/node";
import path from "node:path";

import type { RunResult as RawRunResult } from "./Run";

import { type CommandName, Commands } from "./Commands";

const repoRoot = path.resolve(import.meta.dirname, `..`, `..`, `..`);
const fail = `✗`;
const ellipsis = `…`;
const br = `├`;
const end = `└`;
const bar = `│`;

type RunResult = { exitCode: number; message: string };

type TreeContext = { connector: string; prefix: string };

const treeLine = (prefix: string, connector: string, label: string) => {
  Console.logLine(`${prefix}${connector}─ ${Terminal.cyan(label)}`);
};

const outcome = (raw: RawRunResult): RunResult => {
  const exitCode = _.isObject(raw) ? raw.exitCode : raw;

  const message =
    _.isObject(raw) && `message` in raw
      ? raw.message
      : _.isObject(raw) && `stderr` in raw
        ? [raw.stderr, raw.stdout].filter(Boolean).join(`\n`).trim()
        : ``;

  return { exitCode, message };
};

const logLeafError = (label: string, raw: RawRunResult, message: string) => {
  if (_.isObject(raw) && `stderr` in raw) {
    Console.error(`\n${Terminal.red(`${fail} Error running ${label}`)}\n\n`);
    if (raw.stderr.length > 0) {
      Console.error(raw.stderr);
    }
    if (raw.stdout.length > 0) {
      Console.log(raw.stdout);
    }
  } else if (message !== ``) {
    Console.error(`\n${Terminal.red(`${fail} Error running ${label}`)}\n\n${message}\n`);
  }
};

type RunLeafOptions = {
  backgroundProcesses: ChildProcess[];
  context: TreeContext;
  mcp: boolean;
  verbose: boolean;
  withoutTree?: boolean;
};

const skipLeafTiming = (name: CommandName) => name === `server:frontend:dev`;

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
  const raw = await Promise.resolve(run(root, { backgroundProcesses, capture, mcp, name, verbose }));
  const { exitCode, message } = outcome(raw);

  if (!mcp && !verbose && !skipLeafTiming(name)) {
    const seconds = Math.round((_.now() - start) / _.second);
    const statusIcon = exitCode === 0 ? `✅` : `❌`;
    Console.logLine(`${statusIcon} ${Terminal.dim(`${seconds}s`)}`);
  }

  if (!mcp && exitCode !== 0) {
    logLeafError(label, raw, message);
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
    treeLine(context.prefix, context.connector, label);
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
  const verbose = verboseOpt ?? (mcp === true || (`interactive` in definition && definition.interactive === true));
  const isMcp = mcp === true;
  const start = _.now();
  const withTree = !(`run` in definition) && definition.children.some(Commands.has);
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

export const Runner = { formatCommandsHelp, repoRoot, resolveCommand, run };
