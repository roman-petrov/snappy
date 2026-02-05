/* eslint-disable functional/no-expression-statements */
/* eslint-disable unicorn/no-process-exit */
import { Execute } from "./Execute";
import { Scripts } from "./Scripts";
import { Workflow } from "./Workflow";

const [, , name] = process.argv;

if (name === undefined || name === `` || name === `--help` || name === `-h`) {
  process.stdout.write(`Usage: do <command>\n\nCommands:\n${Workflow.formatCommandsHelp()}\n`);
  process.exit(0);
}

const root = Scripts.rootDir();
const resolved = Workflow.resolve(root, name);

if (!resolved.ok) {
  process.stderr.write(`${resolved.error}\n`);
  process.exit(1);
}

const result = await Execute.run(root, resolved.command, name, { stdio: `inherit` });
process.exit(result.exitCode);
