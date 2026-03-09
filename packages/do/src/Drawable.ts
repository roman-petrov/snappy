// cspell:ignore vectordrawable
/* eslint-disable functional/no-expression-statements */
import fs from "node:fs";
import { join } from "node:path";
import svg2vectordrawable from "svg2vectordrawable";

const svgPath = (root: string) => join(root, `packages`, `ui`, `src`, `assets`, `favicon.svg`);

const drawableDir = (root: string) =>
  join(root, `packages`, `app-android`, `android`, `app`, `src`, `main`, `res`, `drawable`);

const drawableIconPath = (root: string) => join(drawableDir(root), `ic_launcher.xml`);

const generate = async (root: string) => {
  const svg = svgPath(root);
  if (!fs.existsSync(svg)) {
    return;
  }
  const svgCode = fs.readFileSync(svg, `utf8`);
  const xmlCode = await svg2vectordrawable(svgCode, { floatPrecision: 2 });
  fs.mkdirSync(drawableDir(root), { recursive: true });
  fs.writeFileSync(drawableIconPath(root), xmlCode, `utf8`);
};

export const Drawable = { generate };
