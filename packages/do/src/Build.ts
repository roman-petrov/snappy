/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
import { Process, type Runner } from "@snappy/node";

const workflowRunner: Runner = `bun`;
import fs from "node:fs";
import { join } from "node:path";

const distDir = `dist`;
const siteDir = (root: string) => join(root, `packages`, `snappy-site`);
const siteDist = (root: string) => join(siteDir(root), distDir);
const serverDir = (root: string) => join(root, `packages`, `server-prod`);
const serverDist = (root: string) => join(serverDir(root), distDir);
const wwwDir = (root: string) => join(root, distDir, `www`);

const ensureDir = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const copyDir = (src: string, destination: string): void => {
  ensureDir(destination);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destinationPath = join(destination, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destinationPath);
    } else {
      fs.copyFileSync(srcPath, destinationPath);
    }
  }
};

type SpawnResult = { exitCode: number; stderr: string; stdout: string };

const runSpawn = async (cwd: string, argv: string[], capture: boolean): Promise<number | SpawnResult> =>
  Process.spawn(cwd, argv, capture ? { capture: true } : {});

const buildSite = async (root: string, capture: boolean): Promise<number | SpawnResult> => {
  const site = siteDir(root);
  const dist = siteDist(root);
  const siteResult = await runSpawn(site, Process.toolArgv(workflowRunner, `vite`, [`build`]), capture);
  const siteExit = typeof siteResult === `object` ? siteResult.exitCode : siteResult;
  if (siteExit !== 0) {
    return siteResult;
  }

  fs.copyFileSync(join(dist, `src`, `site`, `index.html`), join(dist, `index.html`));
  fs.copyFileSync(join(site, `favicon.svg`), join(dist, `favicon.svg`));

  const appResult = await runSpawn(
    site,
    Process.toolArgv(workflowRunner, `vite`, [`build`, `--config`, `vite.app.config.js`]),
    capture,
  );

  const appExit = typeof appResult === `object` ? appResult.exitCode : appResult;
  if (appExit !== 0) {
    return appResult;
  }

  const ssrResult = await runSpawn(
    site,
    Process.toolArgv(workflowRunner, `vite`, [
      `build`,
      `--ssr`,
      `src/site/entry-server.tsx`,
      `--outDir`,
      `dist/server`,
    ]),
    capture,
  );

  const ssrExit = typeof ssrResult === `object` ? ssrResult.exitCode : ssrResult;
  if (ssrExit !== 0) {
    return ssrResult;
  }

  return 0;
};

const buildServer = async (root: string, capture: boolean): Promise<number | SpawnResult> =>
  runSpawn(serverDir(root), Process.toolArgv(workflowRunner, `vite`, [`build`]), capture);

const build = async (root: string, options: { capture?: true } = {}): Promise<number | SpawnResult> => {
  const dist = join(root, distDir);
  fs.rmSync(dist, { force: true, recursive: true });

  const capture = options.capture === true;
  const siteResult = await buildSite(root, capture);
  const siteExit = typeof siteResult === `object` ? siteResult.exitCode : siteResult;
  if (siteExit !== 0) {
    return siteResult;
  }

  const serverResult = await buildServer(root, capture);
  const serverExit = typeof serverResult === `object` ? serverResult.exitCode : serverResult;
  if (serverExit !== 0) {
    return serverResult;
  }

  copyDir(serverDist(root), join(root, distDir));
  copyDir(siteDist(root), wwwDir(root));

  return 0;
};

export const Build = { build };
