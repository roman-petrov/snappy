// cspell:word gradlew
/* eslint-disable functional/no-expression-statements */
import { _ } from "@snappy/core";
import { Process } from "@snappy/node";
import * as esbuild from "esbuild";
import fs from "node:fs";
import { join } from "node:path";

import { Drawable } from "./Drawable";

const workflowRunner = `bun`;
const distDir = `dist`;
const packageDir = (root: string, packageName: string) => join(root, `packages`, packageName);
const outDir = (root: string, packageName: string) => join(root, distDir, packageName);
const faviconPath = (root: string) => join(root, `packages`, `ui`, `src`, `assets`, `favicon.svg`);

export type BuildOptions = { capture?: true };

const exitCode = (r: number | { exitCode: number; stderr: string; stdout: string }) => (_.isObject(r) ? r.exitCode : r);

const runSpawn = async (cwd: string, argv: string[], capture: boolean) =>
  Process.spawn(cwd, argv, capture ? { capture: true } : {});

const viteBuild = async (root: string, packageName: string, { capture }: BuildOptions = {}) => {
  const cwd = packageDir(root, packageName);
  const out = outDir(root, packageName);
  fs.rmSync(out, { force: true, recursive: true });
  const result = await runSpawn(
    cwd,
    Process.toolArgv(workflowRunner, `vite`, [`build`, `--outDir`, out]),
    capture === true,
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

const site = async (root: string, options: BuildOptions = {}) => viteBuild(root, `site`, options);
const app = async (root: string, options: BuildOptions = {}) => viteBuild(root, `app`, options);
const androidAppDir = (root: string) => packageDir(root, `app-android`);
const androidDir = (root: string) => join(androidAppDir(root), `android`);

const apkOutPath = (root: string, variant: string) =>
  join(
    androidDir(root),
    `app`,
    `build`,
    `outputs`,
    `apk`,
    variant,
    variant === `release` ? `app-release.apk` : `app-debug.apk`,
  );

const gradlew = (root: string) => join(androidDir(root), process.platform === `win32` ? `gradlew.bat` : `gradlew`);

type SpawnResult = { exitCode: number; stderr: string; stdout: string };

const buildAndroidApk = async (
  root: string,
  task: `assembleDebug` | `assembleRelease`,
  distName: string,
  capture: boolean,
): Promise<number | SpawnResult> => {
  await Drawable.generate(root);
  const result = await runSpawn(androidDir(root), [gradlew(root), task], capture);
  if (exitCode(result) !== 0) {
    return result;
  }
  const variant = task === `assembleRelease` ? `release` : `debug`;
  if (!fs.existsSync(apkOutPath(root, variant))) {
    return 1;
  }
  fs.mkdirSync(join(root, distDir), { recursive: true });
  fs.copyFileSync(apkOutPath(root, variant), join(root, distDir, distName));

  return 0;
};

const appAndroid = async (root: string, options: BuildOptions = {}) =>
  buildAndroidApk(root, `assembleRelease`, `snappy.apk`, options.capture === true);

const appAndroidDebug = async (root: string, options: BuildOptions = {}) =>
  buildAndroidApk(root, `assembleDebug`, `snappy-debug.apk`, options.capture === true);

const ssr = async (root: string, { capture }: BuildOptions = {}) => {
  const result = await runSpawn(
    packageDir(root, `site`),
    Process.toolArgv(workflowRunner, `vite`, [
      `build`,
      `--ssr`,
      `src/entry-server.tsx`,
      `--outDir`,
      join(outDir(root, `site`), `server`),
    ]),
    capture === true,
  );

  return exitCode(result) === 0 ? 0 : result;
};

const server = async (root: string) => {
  const packageName = `server-prod`;
  const out = outDir(root, packageName);
  fs.rmSync(out, { force: true, recursive: true });

  return esbuild
    .build({
      banner: { js: `import { createRequire } from "node:module";const require=createRequire(import.meta.url);` },
      bundle: true,
      entryPoints: [join(packageDir(root, packageName), `src`, `main.ts`)],
      format: `esm`,
      minify: false,
      outfile: join(out, `main.js`),
      platform: `node`,
      plugins: [
        {
          name: `external-deps`,
          setup: build =>
            // eslint-disable-next-line require-unicode-regexp, regexp/require-unicode-regexp
            build.onResolve({ filter: /.*/ }, ({ kind, path: id }) =>
              kind === `entry-point` ||
              id.startsWith(`@snappy/`) ||
              id.startsWith(`node:`) ||
              id.startsWith(`.`) ||
              id.startsWith(`/`) ||
              /^[a-z]:[/\\]/iu.test(id)
                ? undefined
                : { external: true },
            ),
        },
      ],
      sourcemap: true,
      target: `node24`,
    })
    .then(() => 0)
    .catch(() => 1);
};

export const Build = { app, appAndroid, appAndroidDebug, server, site, ssr };
