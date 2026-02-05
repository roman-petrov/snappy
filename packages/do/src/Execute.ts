import { Build } from "./Build";
import { Run } from "./Run";
import { RunAll } from "./RunAll";

export type ExecuteOptions = { stdio?: `inherit` | `pipe`; timeoutMs?: number };

export type ExecuteResult = { exitCode: number; message: string };

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
  if (command === `__dev_all__`) {
    const exitCode = await RunAll.runDev(root);

    return { exitCode, message: `Dev exited with code ${exitCode}.` };
  }
  if (command === `__run_all__`) {
    const exitCode = await RunAll.runProd(root);

    return { exitCode, message: `Run exited with code ${exitCode}.` };
  }
  const { stdio = `pipe`, timeoutMs } = options;
  const result = await Run.run(root, command, { stdio, timeoutMs });
  const message = stdio === `inherit` ? `Exited with code ${result.exitCode}.` : Run.formatResult(script, result);

  return { exitCode: result.exitCode, message };
};

export const Execute = { run };
