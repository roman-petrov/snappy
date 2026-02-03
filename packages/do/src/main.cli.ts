import { Commands } from "./Commands.js";
import { Run } from "./Run.js";
import { Scripts } from "./Scripts.js";

const args = process.argv.slice(2);
const name = args[0];

if (name === undefined || name === `` || name === `--help` || name === `-h`) {
  const list = Commands.commands()
    .map(c => `  ${c.name.padEnd(14)} ${c.description}`)
    .join(`\n`);
  process.stdout.write(`Usage: do <command>\n\nCommands:\n${list}\n`);
  process.exit(0);
}

const cmd = Commands.commandByName(name);
if (cmd === undefined) {
  process.stderr.write(`Unknown command: ${name}\n`);
  process.exit(1);
}

const root = Scripts.rootDir();
const result = await Run.run(root, cmd.command, { stdio: `inherit` });
process.exit(result.exitCode);
