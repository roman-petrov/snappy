/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable no-undef */
import fs from "node:fs";
import { join } from "node:path";

const distDir = `dist`;
const siteDir = (root: string) => join(root, `packages`, `snappy-site`);
const siteDist = (root: string) => join(siteDir(root), distDir);
const wwwDir = (root: string) => join(root, distDir, `www`);

const ensureDir = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const copyDir = (src: string, dest: string): void => {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

const spawn = (cmd: string[], cwd: string): Promise<number> =>
  Bun.spawn(cmd, { cwd, stderr: `inherit`, stdin: `ignore`, stdout: `inherit` }).exited.then(code => code ?? 1);

const buildSite = (root: string): Promise<number> => spawn([`bun`, `run`, `build`], siteDir(root));

const buildServer = (root: string): Promise<number> =>
  spawn([`bunx`, `vite`, `build`, `--config`, join(root, `vite.server.config.ts`)], root);

const build = async (root: string): Promise<number> => {
  const dist = join(root, distDir);
  fs.rmSync(dist, { force: true, recursive: true });

  const siteExit = await buildSite(root);
  if (siteExit !== 0) return siteExit;

  const serverExit = await buildServer(root);
  if (serverExit !== 0) return serverExit;

  copyDir(siteDist(root), wwwDir(root));
  return 0;
};

export const Build = { build, buildSite };
