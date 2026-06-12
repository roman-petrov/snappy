/* eslint-disable functional/no-expression-statements */
import { Secrets } from "@snappy/config";
import { Console, Prompt, Terminal } from "@snappy/node";

const fail = (message: string) => {
  Console.errorLine(`${Terminal.red(`✗`)} ${Terminal.red(message)}`);

  return 1;
};

const encrypt = (root: string) => {
  const secretsKey = Secrets.key();
  const result = Secrets.encryptFile(root, secretsKey);
  if (!result.ok) {
    return fail(result.error);
  }

  Console.logLine(``);
  Console.logLine(`💾 Save to GitHub as ${Terminal.cyan(`SECRETS_KEY`)}: ${Terminal.yellow(secretsKey)}`);
  Console.logLine(``);

  return 0;
};

const decrypt = async (root: string) => {
  Console.logLine(``);
  const value = (await Prompt.text(`Secrets key: `)).trim();
  Console.logLine(``);
  if (value === ``) {
    return fail(`Secrets key is required.`);
  }

  const result = Secrets.decryptFile(root, value);
  if (!result.ok) {
    return fail(result.error);
  }

  return 0;
};

export const SecretsCmd = { decrypt, encrypt };
