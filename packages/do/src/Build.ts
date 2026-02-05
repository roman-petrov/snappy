/* eslint-disable no-undef */
/* eslint-disable functional/no-expression-statements */
import fs from "node:fs";
import path from "node:path";

const distDir = `dist`;
const siteStaticExtensions = new Set([`.css`, `.html`, `.ico`, `.svg`]);

const ensureDir = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/* eslint-disable functional/no-loop-statements -- copy files, no pure alternative */
const copySiteStatic = (root: string): void => {
  const siteDir = path.join(root, `packages`, `snappy-site`);
  const outDir = path.join(root, distDir, `site`);
  ensureDir(outDir);
  const entries = fs.readdirSync(siteDir, { withFileTypes: true });

  const files = entries.filter(
    entry => entry.isFile() && siteStaticExtensions.has(path.extname(entry.name)),
  );
  for (const entry of files) {
    fs.copyFileSync(path.join(siteDir, entry.name), path.join(outDir, entry.name));
  }
};

const runBunBuild = (cwd: string, entry: string, outfile: string): Promise<number> =>
  new Promise((resolve, reject) => {
    const proc = Bun.spawn(
      [`bun`, `build`, entry, `--outfile`, outfile, `--target`, `node`, `--minify`],
      { cwd, stderr: `inherit`, stdin: `ignore`, stdout: `inherit` },
    );
    proc.exited.then(code => resolve(code ?? 1)).catch(reject);
  });

const build = async (root: string): Promise<number> => {
  const dist = path.join(root, distDir);
  if (fs.existsSync(dist)) {
    fs.rmSync(dist, { recursive: true });
  }
  ensureDir(path.join(root, distDir, `bot`));

  const botEntry = path.join(root, `packages`, `snappy-bot`, `src`, `main.ts`);
  const botOut = path.join(root, distDir, `bot`, `snappy-bot.js`);

  const botResult = await runBunBuild(root, botEntry, botOut);
  if (botResult !== 0) {
    return botResult;
  }

  copySiteStatic(root);

  const siteEntry = path.join(root, `packages`, `snappy-site`, `src`, `main.ts`);
  const siteOut = path.join(root, distDir, `site-server.js`);

  const siteResult = await runBunBuild(root, siteEntry, siteOut);
  if (siteResult !== 0) {
    return siteResult;
  }

  return 0;
};

export const Build = { build };
