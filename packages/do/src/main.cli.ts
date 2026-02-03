/* eslint-disable functional/no-expression-statements */
/* eslint-disable unicorn/no-process-exit */
import fs from "node:fs";
import path from "node:path";

import { Commands } from "./Commands.js";
import { Run } from "./Run.js";
import { Scripts } from "./Scripts.js";

const [, , name, packageArg] = process.argv;

if (name === undefined || name === `` || name === `--help` || name === `-h`) {
  const padEnd = 14;

  const list = Commands.commands()
    .map(c => `  ${c.name.padEnd(padEnd)} ${c.description}`)
    .join(`\n`);
  process.stdout.write(`Usage: do <command> [<package>]\n\nCommands:\n${list}\n`);
  process.exit(0);
}

const cmd = Commands.commandByName(name);
if (cmd === undefined) {
  process.stderr.write(`Unknown command: ${name}\n`);
  process.exit(1);
}

const root = Scripts.rootDir();

const runOrDevCommand = (): string => {
  if (packageArg === undefined || packageArg === ``) {
    process.stderr.write(`Usage: do ${name} <package>\n`);
    process.exit(1);
  }
  const scriptPath = path.join(root, `packages`, packageArg, `src`, `main.ts`);
  if (!fs.existsSync(scriptPath)) {
    process.stderr.write(`Package not found or has no src/main.ts: ${packageArg}\n`);
    process.exit(1);
  }

  return name === `dev` ? `bun --watch run ${scriptPath}` : `bun run ${scriptPath}`;
};

const command = cmd.name === `run` || cmd.name === `dev` ? runOrDevCommand() : cmd.command;
const result = await Run.run(root, command, { stdio: `inherit` });
process.exit(result.exitCode);
