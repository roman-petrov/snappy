/* eslint-disable functional/no-expression-statements */
/* eslint-disable unicorn/no-process-exit */
import { Runner } from "./Runner";
import { Scripts } from "./Scripts";

const [, , name] = process.argv;

if (name === undefined || name === `` || name === `--help` || name === `-h`) {
  process.stdout.write(`Usage: do <command>\n\nCommands:\n${Runner.formatCommandsHelp()}\n`);
  process.exit(0);
}

const root = Scripts.rootDir();
const resolved = Runner.resolve(name);

if (!resolved.ok) {
  process.stderr.write(`${resolved.error}\n`);
  process.exit(1);
}

process.exit((await Runner.run(root, resolved.name)).exitCode);
