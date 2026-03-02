/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
import { Process } from "@snappy/node";

const workflowRunner = `bun`;
import fs from "node:fs";
import { join } from "node:path";

const distDir = `dist`;
const siteDir = (root: string) => join(root, `packages`, `snappy-site`);
const siteDist = (root: string) => join(siteDir(root), distDir);
const wwwDir = (root: string) => join(root, distDir, `www`);

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const copyDir = (src: string, destination: string) => {
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

const exitCode = (r: number | SpawnResult) => (typeof r === `object` ? r.exitCode : r);

const runSpawn = async (cwd: string, argv: string[], capture: boolean): Promise<number | SpawnResult> =>
  Process.spawn(cwd, argv, capture ? { capture: true } : {});

const buildSite = async (root: string, options: { capture?: true } = {}): Promise<number | SpawnResult> => {
  fs.rmSync(join(root, distDir), { force: true, recursive: true });
  const site = siteDir(root);
  const dist = siteDist(root);
  const result = await runSpawn(site, Process.toolArgv(workflowRunner, `vite`, [`build`]), options.capture === true);
  if (exitCode(result) !== 0) {
    return result;
  }
  fs.copyFileSync(join(dist, `src`, `site`, `index.html`), join(dist, `index.html`));
  fs.copyFileSync(join(site, `favicon.svg`), join(dist, `favicon.svg`));

  return 0;
};

const buildApp = async (root: string, options: { capture?: true } = {}): Promise<number | SpawnResult> =>
  runSpawn(
    siteDir(root),
    Process.toolArgv(workflowRunner, `vite`, [`build`, `--config`, `vite.app.config.js`]),
    options.capture === true,
  );

const buildSsr = async (root: string, options: { capture?: true } = {}): Promise<number | SpawnResult> => {
  const result = await runSpawn(
    siteDir(root),
    Process.toolArgv(workflowRunner, `vite`, [
      `build`,
      `--ssr`,
      `src/site/entry-server.tsx`,
      `--outDir`,
      `dist/server`,
    ]),
    options.capture === true,
  );
  if (exitCode(result) !== 0) {
    return result;
  }
  const dist = siteDist(root);
  if (fs.existsSync(join(dist, `index.html`))) {
    ensureDir(wwwDir(root));
    copyDir(dist, wwwDir(root));
  }

  return 0;
};

export const Build = { buildApp, buildSite, buildSsr };
