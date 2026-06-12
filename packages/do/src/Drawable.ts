// cspell:ignore vectordrawable
/* eslint-disable functional/no-expression-statements */
import fs from "node:fs";
import { join } from "node:path";
import svg2vectordrawable from "svg2vectordrawable";

const generate = async (root: string) => {
  const svg = join(root, `packages`, `ui`, `src`, `assets`, `favicon.svg`);
  if (!fs.existsSync(svg)) {
    return;
  }
  const drawable = join(root, `packages`, `app-android`, `android`, `app`, `src`, `main`, `res`, `drawable`);
  const svgCode = fs.readFileSync(svg, `utf8`);
  const xmlCode = await svg2vectordrawable(svgCode, { floatPrecision: 2 });
  fs.mkdirSync(drawable, { recursive: true });
  fs.writeFileSync(join(drawable, `ic_launcher.xml`), xmlCode, `utf8`);
};

export const Drawable = { generate };
