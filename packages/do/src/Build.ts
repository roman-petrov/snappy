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

const buildSite = async (root: string): Promise<number> => {
  const site = siteDir(root);
  const dist = siteDist(root);
  const siteExit = await Process.spawn(site, Process.toolArgv(workflowRunner, `vite`, [`build`]));
  if (siteExit !== 0) {
    return siteExit;
  }

  fs.copyFileSync(join(dist, `src`, `site`, `index.html`), join(dist, `index.html`));
  fs.copyFileSync(join(site, `favicon.svg`), join(dist, `favicon.svg`));

  const appExit = await Process.spawn(site, Process.toolArgv(workflowRunner, `vite`, [`build`, `--config`, `vite.app.config.js`]));
  if (appExit !== 0) {
    return appExit;
  }

  const ssrExit = await Process.spawn(
    site,
    Process.toolArgv(workflowRunner, `vite`, [`build`, `--ssr`, `src/site/entry-server.tsx`, `--outDir`, `dist/server`]),
  );
  if (ssrExit !== 0) {
    return ssrExit;
  }

  return 0;
};

const buildServer = async (root: string): Promise<number> =>
  Process.spawn(serverDir(root), Process.toolArgv(workflowRunner, `vite`, [`build`]));

const build = async (root: string): Promise<number> => {
  const dist = join(root, distDir);
  fs.rmSync(dist, { force: true, recursive: true });

  const siteExit = await buildSite(root);
  if (siteExit !== 0) {
    return siteExit;
  }

  const serverExit = await buildServer(root);
  if (serverExit !== 0) {
    return serverExit;
  }

  copyDir(serverDist(root), join(root, distDir));
  copyDir(siteDist(root), wwwDir(root));

  return 0;
};

export const Build = { build, buildSite };
