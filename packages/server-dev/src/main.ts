/* eslint-disable unicorn/no-process-exit */
import { Config } from "@snappy/server";
import { SnappyBot } from "@snappy/snappy-bot";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createServer } from "vite";

const root = join(import.meta.dir, `..`, `..`, `..`);
const siteDir = join(root, `packages`, `snappy-site`);
const vitePort = 5173;
const exitCodeSigint = 130;
const vite = await createServer({ configFile: join(siteDir, `vite.config.ts`), root: siteDir });
await vite.listen(vitePort);
vite.bindCLIShortcuts({ print: true });

const shutdown = () => {
  void vite.close().then(() => process.exit(exitCodeSigint));
};
process.on(`SIGINT`, shutdown);
process.on(`SIGTERM`, shutdown);

const configPath = join(homedir(), `snappy`, `config.json`);
if (!existsSync(configPath)) {
  throw new Error(`Config file not found at ${configPath}`);
}
const config = Config(readFileSync(configPath, `utf-8`));
const bot = SnappyBot(config);

process.stdout.write(`🚀 Starting server…\n`);
void bot.start();
