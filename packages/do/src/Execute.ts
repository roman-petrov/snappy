/* eslint-disable functional/no-loop-statements */
/* eslint-disable no-await-in-loop */
import { Build } from "./Build";
import { Commands } from "./Commands";
import { Run } from "./Run";
import { RunAll } from "./RunAll";

type ExecuteOptions = { stdio?: `inherit` | `pipe` };

type ExecuteResult = { exitCode: number; message: string };

const runStep = async (root: string, step: string, options: ExecuteOptions): Promise<ExecuteResult> => {
  if (step === `build`) {
    const exitCode = await Build.build(root);

    return { exitCode, message: exitCode === 0 ? `Build ok.` : `Build failed.` };
  }
  const cmd = Commands.commandByName(step);
  if (cmd === undefined) {
    return { exitCode: 1, message: `Unknown step: ${step}` };
  }
  const { stdio = `pipe` } = options;
  const result = await Run.run(root, cmd.command, { stdio });
  const message = stdio === `inherit` ? `Exited with code ${result.exitCode}.` : Run.formatResult(step, result);

  return { exitCode: result.exitCode, message };
};

const run = async (
  root: string,
  command: string,
  script: string,
  options: ExecuteOptions = {},
): Promise<ExecuteResult> => {
  if (command === `ci`) {
    for (const step of Commands.ciStepNames) {
      const result = await runStep(root, step, options);
      if (result.exitCode !== 0) {
        return result;
      }
    }

    return { exitCode: 0, message: `CI ok.` };
  }
  if (command === `build`) {
    return runStep(root, `build`, options);
  }
  if (command === `dev`) {
    const exitCode = await RunAll.runDev(root);

    return { exitCode, message: `Dev exited with code ${exitCode}.` };
  }
  if (command === `run`) {
    const exitCode = await RunAll.runProd(root);

    return { exitCode, message: `Run exited with code ${exitCode}.` };
  }

  return runStep(root, script, options);
};

export const Execute = { run };
