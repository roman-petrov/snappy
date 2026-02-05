/* eslint-disable functional/no-expression-statements */
/* eslint-disable unicorn/no-process-exit */
import { Build } from "./Build";
import { Run } from "./Run";
import { RunAll } from "./RunAll";
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

if (name === `build`) {
  process.exit(await Build.build(root));
}

if (resolved.command === `__dev_all__`) {
  process.exit(await RunAll.runDev(root));
}
if (resolved.command === `__run_all__`) {
  process.exit(await RunAll.runProd(root));
}

const result = await Run.run(root, resolved.command, { stdio: `inherit` });
process.exit(result.exitCode);
