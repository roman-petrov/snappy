/* eslint-disable functional/no-expression-statements */
import type { Environment } from "@snappy/config";

import { Console, Terminal } from "@snappy/node";
import { S3 } from "@snappy/s3";

import { SecretsKey } from "./SecretsKey";

const run = async (mode: Environment, secretsKey?: string) => {
  const result = await S3.setup(mode, secretsKey);
  if (!result.ok) {
    Console.errorLine(`${Terminal.red(`✗`)} ${Terminal.red(result.error)}`);

    return 1;
  }

  Console.logLine(`${Terminal.green(`✓`)} S3 storage ready`);

  return 0;
};

const dev = async () => run(`dev`);

const prod = async () => {
  const keyResult = await SecretsKey.prompt();
  if (!keyResult.ok) {
    Console.errorLine(`${Terminal.red(`✗`)} ${Terminal.red(keyResult.error)}`);

    return 1;
  }

  return run(`prod`, keyResult.value);
};

export const SetupS3 = { dev, prod };
