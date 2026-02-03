/* eslint-disable functional/no-expression-statements */
/* eslint-disable unicorn/no-process-exit */
import { Run } from "./Run";
import { Scripts } from "./Scripts";
import { Workflow } from "./Workflow";

const [, , name, packageArg] = process.argv;

if (name === undefined || name === `` || name === `--help` || name === `-h`) {
  process.stdout.write(`Usage: do <command> [<package>]\n\nCommands:\n${Workflow.formatCommandsHelp()}\n`);
  process.exit(0);
}

const root = Scripts.rootDir();
const resolved = Workflow.resolve(root, name, packageArg);

if (!resolved.ok) {
  process.stderr.write(`${resolved.error}\n`);
  process.exit(1);
}

const result = await Run.run(root, resolved.command, { stdio: `inherit` });
process.exit(result.exitCode);
