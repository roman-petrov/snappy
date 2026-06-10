/* eslint-disable functional/no-expression-statements */
import { Secrets } from "@snappy/config";
import { Console, Prompt, Terminal } from "@snappy/node";

const fail = (message: string) => {
  Console.errorLine(`${Terminal.red(`✗`)} ${Terminal.red(message)}`);

  return 1;
};

const keyFromPrompt = async () => {
  const key = (await Prompt.text(`Secrets key: `)).trim();

  return key === `` ? fail(`Secrets key is required.`) : key;
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
  const key = await keyFromPrompt();
  Console.logLine(``);
  if (typeof key === `number`) {
    return key;
  }

  const result = Secrets.decryptFile(root, key);
  if (!result.ok) {
    return fail(result.error);
  }

  return 0;
};

export const SecretsCmd = { decrypt, encrypt };
