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

const runSpawn = async (cwd: string, argv: string[], capture: boolean): Promise<number> => {
  const result = await Process.spawn(cwd, argv, capture ? { capture: true } : {});

  if (typeof result === `object` && result.exitCode !== 0) {
    if (result.stderr.length > 0) {
      process.stderr.write(result.stderr);
    }
    if (result.stdout.length > 0) {
      process.stdout.write(result.stdout);
    }
  }

  return typeof result === `object` ? result.exitCode : result;
};

const buildSite = async (root: string, capture: boolean): Promise<number> => {
  const site = siteDir(root);
  const dist = siteDist(root);
  const siteExit = await runSpawn(site, Process.toolArgv(workflowRunner, `vite`, [`build`]), capture);
  if (siteExit !== 0) {
    return siteExit;
  }

  fs.copyFileSync(join(dist, `src`, `site`, `index.html`), join(dist, `index.html`));
  fs.copyFileSync(join(site, `favicon.svg`), join(dist, `favicon.svg`));

  const appExit = await runSpawn(
    site,
    Process.toolArgv(workflowRunner, `vite`, [`build`, `--config`, `vite.app.config.js`]),
    capture,
  );
  if (appExit !== 0) {
    return appExit;
  }

  const ssrExit = await runSpawn(
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
  if (ssrExit !== 0) {
    return ssrExit;
  }

  return 0;
};

const buildServer = async (root: string, capture: boolean): Promise<number> =>
  runSpawn(serverDir(root), Process.toolArgv(workflowRunner, `vite`, [`build`]), capture);

const build = async (root: string, options: { capture?: true } = {}): Promise<number> => {
  const dist = join(root, distDir);
  fs.rmSync(dist, { force: true, recursive: true });

  const capture = options.capture === true;
  const siteExit = await buildSite(root, capture);
  if (siteExit !== 0) {
    return siteExit;
  }

  const serverExit = await buildServer(root, capture);
  if (serverExit !== 0) {
    return serverExit;
  }

  copyDir(serverDist(root), join(root, distDir));
  copyDir(siteDist(root), wwwDir(root));

  return 0;
};

export const Build = { build, buildSite };
