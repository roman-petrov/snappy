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

const buildSite = async (root: string, capture: boolean): Promise<number | SpawnResult> => {
  const site = siteDir(root);
  const dist = siteDist(root);
  const siteResult = await runSpawn(site, Process.toolArgv(workflowRunner, `vite`, [`build`]), capture);
  if (exitCode(siteResult) !== 0) {
    return siteResult;
  }

  fs.copyFileSync(join(dist, `src`, `site`, `index.html`), join(dist, `index.html`));
  fs.copyFileSync(join(site, `favicon.svg`), join(dist, `favicon.svg`));

  const appResult = await runSpawn(
    site,
    Process.toolArgv(workflowRunner, `vite`, [`build`, `--config`, `vite.app.config.js`]),
    capture,
  );

  if (exitCode(appResult) !== 0) {
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

  if (exitCode(ssrResult) !== 0) {
    return ssrResult;
  }

  return 0;
};

const build = async (root: string, options: { capture?: true } = {}): Promise<number | SpawnResult> => {
  const dist = join(root, distDir);
  fs.rmSync(dist, { force: true, recursive: true });

  const capture = options.capture === true;
  const siteResult = await buildSite(root, capture);
  if (exitCode(siteResult) !== 0) {
    return siteResult;
  }

  ensureDir(wwwDir(root));
  copyDir(siteDist(root), wwwDir(root));

  return 0;
};

export const Build = { build };
