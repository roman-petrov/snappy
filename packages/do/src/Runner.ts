/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable no-await-in-loop */
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
  if (definition.type === `leaf`) {
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

const runLeaf = async (root: string, name: string, context: TreeContext, verbose: boolean): Promise<RunResult> => {
  const definition = Commands.byName(name);
  if (definition?.type !== `leaf`) {
    return { exitCode: 1, message: `Unknown: ${name}` };
  }

  const { exitCode, message } = await definition.execute(root);

  if (!verbose) {
    treeLine(context.prefix, context.connector, definition.label, exitCode === 0 ? `ok` : `fail`);
  }

  return { exitCode, message };
};

const runNode = async (
  root: string,
  name: string,
  context: TreeContext,
  verbose: boolean,
  isRoot?: boolean,
): Promise<RunResult> => {
  const definition = Commands.byName(name);
  if (definition === undefined) {
    return { exitCode: 1, message: `Unknown: ${name}` };
  }

  if (definition.type === `leaf`) {
    return runLeaf(root, name, context, verbose);
  }

  if (isRoot !== true && !verbose) {
    treeLine(context.prefix, context.connector, definition.label, `node`);
  }

  const childPrefix = context.prefix + (context.connector === end ? `   ` : `${bar}  `);
  const siblings = definition.children;
  for (const [index, child] of siblings.entries()) {
    const childConnector = index === siblings.length - 1 ? end : br;
    const result = await runNode(root, child, { connector: childConnector, prefix: childPrefix }, verbose);
    if (result.exitCode !== 0) {
      return result;
    }
  }

  return { exitCode: 0, message: `` };
};

const run = async (root: string, name: string, options: { verbose?: boolean } = {}): Promise<RunResult> => {
  const { verbose = false } = options;
  const node = tree(name);
  if (node === undefined) {
    return { exitCode: 1, message: `Unknown command: ${name}` };
  }

  const rootDefinition = Commands.byName(name);
  if (!verbose) {
    process.stdout.write(`\n`);
    if (node.children.length > 0 && rootDefinition !== undefined) {
      process.stdout.write(` ${yellow}${br}${reset}─ ${cyan}${rootDefinition.label}${reset}\n`);
    }
  }

  const result = await runNode(root, name, { connector: br, prefix: ` ` }, verbose, true);

  if (!verbose && result.exitCode !== 0 && result.message) {
    process.stderr.write(`\n${red}${fail} ${name} failed${reset}\n\n${result.message}\n`);
  }

  const message = result.exitCode === 0 && result.message === `` ? `${name} ok.` : result.message;

  return { ...result, message };
};

export const Runner = { run, tree };
