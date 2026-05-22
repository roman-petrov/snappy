/* eslint-disable functional/no-expression-statements */
import { _ } from "@snappy/core";
import { Console, Process, type SpawnResult, Terminal } from "@snappy/node";
import fs from "node:fs";
import { join } from "node:path";

const workflowRunner = `bun`;
const migrationsDir = `packages/db/prisma/migrations`;
const schemaPath = `packages/db/prisma/schema.prisma`;
const mainBranch = `main`;
const slugMax = 100;

const prisma = async (root: string, args: string[]) =>
  Process.spawn(root, Process.toolArgv(workflowRunner, `prisma`, args), {});

const branch = async (root: string): Promise<number | SpawnResult | string> => {
  const result = await Process.spawn(root, [`git`, `branch`, `--show-current`], { capture: true });

  return !_.isObject(result) || Process.exitCode(result) !== 0 ? result : result.stdout.trim();
};

const migrationSlug = (name: string) => {
  const slug = name
    .toLowerCase()
    .replaceAll(/[^0-9a-z]+/gu, `_`)
    .replaceAll(/^_|_$/gu, ``);

  return slug.length > slugMax ? slug.slice(0, slugMax).replaceAll(/_$/gu, ``) : slug;
};

const migrationId = (slug: string) => {
  const now = new Date();
  const pad = (value: number) => `${value}`.padStart(2, `0`);
  const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}`;

  return `${stamp}_${slug}`;
};

const emptySql = (sql: string) =>
  sql
    .split(`\n`)
    .map(line => line.replace(/^\s*--.*/u, ``).trim())
    .join(``)
    .trim() === ``;

const fail = (message: string) => {
  Console.errorLine(`${Terminal.red(`✗`)} ${Terminal.red(message)}`);

  return 1;
};

const finish = async (root: string) => {
  const branchResult = await branch(root);
  if (!_.isString(branchResult)) {
    return branchResult;
  }

  if (branchResult === ``) {
    return fail(`Not a git repository or detached HEAD.`);
  }
  if (branchResult === mainBranch) {
    return fail(`Run on a feature branch, not ${mainBranch}.`);
  }

  const slug = migrationSlug(branchResult);
  if (slug === ``) {
    return fail(`Cannot derive a migration name from branch "${branchResult}".`);
  }

  const pushResult = await prisma(root, [`db`, `push`, `--accept-data-loss`]);
  if (Process.exitCode(pushResult) !== 0) {
    return pushResult;
  }

  const diffResult = await Process.spawn(
    root,
    Process.toolArgv(workflowRunner, `prisma`, [
      `migrate`,
      `diff`,
      `--from-migrations`,
      migrationsDir,
      `--to-schema`,
      schemaPath,
      `--script`,
    ]),
    { capture: true },
  );
  if (Process.exitCode(diffResult) !== 0) {
    return diffResult;
  }
  if (!_.isObject(diffResult)) {
    return diffResult;
  }

  const sql = diffResult.stdout.trim();
  const created = emptySql(sql) ? undefined : migrationId(slug);
  if (created !== undefined) {
    const migrationPath = join(root, migrationsDir, created);
    if (fs.existsSync(migrationPath)) {
      return fail(`Migration folder already exists: ${created}`);
    }

    fs.mkdirSync(migrationPath, { recursive: true });
    fs.writeFileSync(join(migrationPath, `migration.sql`), `${sql}\n`);

    const resolveResult = await prisma(root, [`migrate`, `resolve`, `--applied`, created]);
    if (Process.exitCode(resolveResult) !== 0) {
      return resolveResult;
    }
  }

  const generateResult = await prisma(root, [`generate`]);
  if (Process.exitCode(generateResult) !== 0) {
    return generateResult;
  }

  Console.log(``);
  Console.logLine(`✅ ${Terminal.green(Terminal.bold(`Ready to merge`))}`);
  Console.logLine(
    created === undefined
      ? `   ${Terminal.yellow(`⚠`)} ${Terminal.dim(`No new migration`)} · ${Terminal.dim(`client updated`)}`
      : `   ${Terminal.green(`✓`)} ${Terminal.dim(`Migration`)} ${Terminal.cyan(created)}`,
  );
  Console.log(``);

  return 0;
};

export const Feature = { finish };
