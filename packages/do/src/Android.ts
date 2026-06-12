/* cspell:ignore vectordrawable gradlew
   cspell:word gradlew */
/* eslint-disable functional/no-expression-statements */
import { Process } from "@snappy/node";
import fs from "node:fs";
import { join } from "node:path";
import svg2vectordrawable from "svg2vectordrawable";

const androidDir = (root: string) => join(root, `packages`, `app-android`, `android`);
const gradlew = (root: string) => join(androidDir(root), process.platform === `win32` ? `gradlew.bat` : `gradlew`);

const drawable = async (root: string) => {
  const svg = join(root, `packages`, `ui`, `src`, `assets`, `favicon.svg`);
  if (!fs.existsSync(svg)) {
    return;
  }
  const dir = join(androidDir(root), `app`, `src`, `main`, `res`, `drawable`);
  const svgCode = fs.readFileSync(svg, `utf8`);
  const xmlCode = await svg2vectordrawable(svgCode, { floatPrecision: 2 });
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(join(dir, `ic_launcher.xml`), xmlCode, `utf8`);
};

const apkOutPath = (root: string, variant: `debug` | `release`) =>
  join(
    androidDir(root),
    `app`,
    `build`,
    `outputs`,
    `apk`,
    variant,
    variant === `release` ? `app-release.apk` : `app-debug.apk`,
  );

const spawnGradle = async (root: string, task: string, capture: boolean) =>
  Process.spawn(androidDir(root), [gradlew(root), task], capture ? { capture: true } : {});

export const Android = { apkOutPath, drawable, spawnGradle };
