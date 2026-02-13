/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
import { spawn } from "node:child_process";
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

const run = (cmd: string[], cwd: string): Promise<number> =>
  new Promise((resolve, reject) => {
    const [exe, ...args] = cmd;
    const proc = spawn(exe ?? ``, args, { cwd, stdio: `inherit` });
    proc.on(`close`, (code: number | null) => resolve(code ?? 0));
    proc.on(`error`, reject);
  });

const buildSite = async (root: string): Promise<number> => {
  const site = siteDir(root);
  const dist = siteDist(root);
  const siteExit = await run([`npx`, `vite`, `build`], site);
  if (siteExit !== 0) {
    return siteExit;
  }

  fs.copyFileSync(join(dist, `src`, `site`, `index.html`), join(dist, `index.html`));
  fs.copyFileSync(join(site, `favicon.svg`), join(dist, `favicon.svg`));

  const appExit = await run([`npx`, `vite`, `build`, `--config`, `vite.app.config.js`], site);
  if (appExit !== 0) {
    return appExit;
  }

  const ssrExit = await run(
    [`npx`, `vite`, `build`, `--ssr`, `src/site/entry-server.tsx`, `--outDir`, `dist/server`],
    site,
  );
  if (ssrExit !== 0) {
    return ssrExit;
  }

  return 0;
};

const buildServer = async (root: string): Promise<number> => run([`npx`, `vite`, `build`], serverDir(root));

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
