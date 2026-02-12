/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/strict-void-return */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
import { join } from "node:path";
import open from "open";

import { Build } from "./Build";

const spawnOptions = { stderr: `inherit` as const, stdin: `inherit` as const, stdout: `inherit` as const };
const silentOptions = { stderr: `ignore` as const, stdin: `inherit` as const, stdout: `ignore` as const };

const run = async (cwd: string, cmd: string[], options?: { env?: Record<string, string>; silent?: boolean }) =>
  Bun.spawn(cmd, {
    cwd,
    ...(options?.silent === true ? silentOptions : spawnOptions),
    ...(options?.env !== undefined && { env: { ...process.env, ...options.env } }),
  }).exited;

const log = {
  fail: (label: string) => process.stderr.write(`  ❌ ${label}\n`),
  ok: (label: string) => process.stdout.write(`  ✅ ${label}\n`),
  section: (title: string) => process.stdout.write(`\n${title}\n`),
  step: (label: string) => process.stdout.write(`  ⏳ ${label}...\n`),
};

const runStep = async (root: string, cmd: string[], label: string) => {
  log.step(label);
  const code = await run(root, cmd, { silent: true });

  if (code !== 0) {
    log.fail(label);

    return code;
  }
  log.ok(label);

  return 0;
};

const DB_STEPS: [string[], string][] = [
  [[`docker`, `compose`, `up`, `-d`], `Database container`],
  [[`bunx`, `prisma`, `db`, `push`, `--accept-data-loss`], `Schema sync`],
  [[`bunx`, `prisma`, `db`, `seed`], `Seed`],
];

const dbStart = async (root: string): Promise<number> => {
  for (const [cmd, label] of DB_STEPS) {
    const code = await runStep(root, cmd, label);
    if (code !== 0) {
      return code;
    }
  }

  return 0;
};

const dbStop = async (root: string): Promise<void> => {
  process.stdout.write(`  Stopping database...\n`);
  await run(root, [`docker`, `compose`, `down`], { silent: true });
  process.stdout.write(`  Done\n`);
};

const serverMainPath = (root: string) => join(root, `packages`, `server-dev`, `src`, `main.ts`);
const sitePath = (root: string) => join(root, `packages`, `snappy-site`);
const distServerPath = (root: string) => join(root, `dist`, `server.js`);
const vitePort = 5173;

const withShutdown = (root: string, onKill: () => void) => {
  const state = { done: false };

  const shutdown = async () => {
    if (state.done) {
      return;
    }
    state.done = true;
    process.stdout.write(`\nShutdown\n`);
    onKill();
    await dbStop(root);
  };
  process.on(`SIGINT`, async () => {
    await shutdown();
    process.exit(0);
  });
  process.on(`SIGTERM`, async () => {
    await shutdown();
    process.exit(0);
  });

  return async (exitCodePromise: Promise<number>) => {
    const code = await exitCodePromise;
    await shutdown();

    return code;
  };
};

const runDev = async (root: string) => {
  log.section(`🚀 Dev`);
  const dbCode = await dbStart(root);
  if (dbCode !== 0) {
    return dbCode;
  }

  log.section(`🖥️ Servers`);

  const viteProc = Bun.spawn([`bun`, `run`, `dev`], { cwd: sitePath(root), ...spawnOptions });

  const serverProc = Bun.spawn([`bun`, `--watch`, `run`, serverMainPath(root)], {
    cwd: root,
    ...spawnOptions,
    env: { ...process.env, NODE_ENV: `development` },
  });
  log.ok(`http://localhost:${vitePort} 🌐`);

  const runUntilExit = withShutdown(root, () => {
    viteProc.kill();
    serverProc.kill();
  });

  await open(`http://localhost:${vitePort}`);

  return runUntilExit(serverProc.exited);
};

const runProd = async (root: string) => {
  log.section(`📦 Build`);
  const buildExit = await Build.build(root);
  if (buildExit !== 0) {
    return buildExit;
  }

  log.section(`🚀 Prod`);
  const dbCode = await dbStart(root);
  if (dbCode !== 0) {
    return dbCode;
  }

  log.section(`🖥️ Server`);

  const serverProc = Bun.spawn([`node`, distServerPath(root)], { cwd: root, ...spawnOptions });
  const runUntilExit = withShutdown(root, () => serverProc.kill());

  return runUntilExit(serverProc.exited);
};

export const RunAll = { runDev, runProd };
