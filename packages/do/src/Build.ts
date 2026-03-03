/* eslint-disable functional/no-expression-statements */
import { Process } from "@snappy/node";

const workflowRunner = `bun`;
import fs from "node:fs";
import { join } from "node:path";

const distDir = `dist`;
const packageDir = (root: string, packageName: string) => join(root, `packages`, packageName);
const outDir = (root: string, packageName: string) => join(root, distDir, packageName);
const faviconPath = (root: string) => join(root, `packages`, `ui`, `src`, `assets`, `favicon.svg`);

const exitCode = (r: number | { exitCode: number; stderr: string; stdout: string }) =>
  typeof r === `object` ? r.exitCode : r;

const runSpawn = async (cwd: string, argv: string[], capture: boolean) =>
  Process.spawn(cwd, argv, capture ? { capture: true } : {});

const viteBuild = async (root: string, packageName: string, options: { capture?: true }) => {
  const cwd = packageDir(root, packageName);
  const out = outDir(root, packageName);
  fs.rmSync(out, { force: true, recursive: true });
  const result = await runSpawn(
    cwd,
    Process.toolArgv(workflowRunner, `vite`, [`build`, `--outDir`, out]),
    options.capture === true,
  );
  if (exitCode(result) !== 0) {
    return result;
  }
  const favicon = faviconPath(root);
  if (fs.existsSync(favicon)) {
    fs.copyFileSync(favicon, join(out, `favicon.svg`));
  }

  return 0;
};

const site = async (root: string, options: { capture?: true } = {}) => viteBuild(root, `site`, options);
const appDesktop = async (root: string, options: { capture?: true } = {}) => viteBuild(root, `app-desktop`, options);
const appMobile = async (root: string, options: { capture?: true } = {}) => viteBuild(root, `app-mobile`, options);

const ssr = async (root: string, options: { capture?: true } = {}) => {
  const result = await runSpawn(
    packageDir(root, `site`),
    Process.toolArgv(workflowRunner, `vite`, [
      `build`,
      `--ssr`,
      `src/entry-server.tsx`,
      `--outDir`,
      join(outDir(root, `site`), `server`),
    ]),
    options.capture === true,
  );

  return exitCode(result) === 0 ? 0 : result;
};

export const Build = { appDesktop, appMobile, site, ssr };
