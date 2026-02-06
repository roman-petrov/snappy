/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable no-undef */
import fs from "node:fs";
import { extname, join } from "node:path";

const distDir = `dist`;
const siteStaticExtensions = new Set([`.css`, `.html`, `.ico`, `.svg`]);

const ensureDir = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const copySiteStatic = (root: string): void => {
  const siteDir = join(root, `packages`, `snappy-site`);
  const outDir = join(root, distDir, `www`);
  ensureDir(outDir);
  const entries = fs.readdirSync(siteDir, { withFileTypes: true });
  const files = entries.filter(entry => entry.isFile() && siteStaticExtensions.has(extname(entry.name)));
  for (const entry of files) {
    fs.copyFileSync(join(siteDir, entry.name), join(outDir, entry.name));
  }
};

const runBunBuild = async (cwd: string, entry: string, outfile: string) => {
  const proc = Bun.spawn([`bun`, `build`, entry, `--outfile`, outfile, `--target`, `node`, `--minify`], {
    cwd,
    stderr: `inherit`,
    stdin: `ignore`,
    stdout: `inherit`,
  });

  const code = await proc.exited;

  return code;
};

const build = async (root: string) => {
  const dist = join(root, distDir);
  fs.rmSync(dist, { force: true, recursive: true });
  ensureDir(dist);

  copySiteStatic(root);

  const serverEntry = join(root, `packages`, `server-prod`, `src`, `main.ts`);
  const serverOut = join(root, distDir, `server.js`);
  const serverResult = await runBunBuild(root, serverEntry, serverOut);
  if (serverResult !== 0) {
    return serverResult;
  }

  return 0;
};

export const Build = { build };
