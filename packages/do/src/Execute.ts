import { Build } from "./Build";
import { Run } from "./Run";
import { RunAll } from "./RunAll";

type ExecuteOptions = { stdio?: `inherit` | `pipe` };

type ExecuteResult = { exitCode: number; message: string };

const run = async (
  root: string,
  command: string,
  script: string,
  options: ExecuteOptions = {},
): Promise<ExecuteResult> => {
  if (command === `build`) {
    const exitCode = await Build.build(root);

    return { exitCode, message: exitCode === 0 ? `Build ok.` : `Build failed.` };
  }
  if (command === `dev`) {
    const exitCode = await RunAll.runDev(root);

    return { exitCode, message: `Dev exited with code ${exitCode}.` };
  }
  if (command === `run`) {
    const exitCode = await RunAll.runProd(root);

    return { exitCode, message: `Run exited with code ${exitCode}.` };
  }
  const { stdio = `pipe` } = options;
  const result = await Run.run(root, command, { stdio });
  const message = stdio === `inherit` ? `Exited with code ${result.exitCode}.` : Run.formatResult(script, result);

  return { exitCode: result.exitCode, message };
};

export const Execute = { run };
