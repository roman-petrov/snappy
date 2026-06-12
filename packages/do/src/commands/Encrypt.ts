/* eslint-disable functional/no-expression-statements */
import { Secrets } from "@snappy/config";
import { Console, Terminal } from "@snappy/node";

import type { Command } from "../Command";

import { Run } from "../Run";

export const Encrypt: Command = {
  description: `Generate key and encrypt secrets.prod.yaml to secrets.prod.enc.yaml.`,
  interactive: true,
  label: `🔒 Encrypt prod secrets`,
  name: `encrypt`,
  run: root => {
    const secretsKey = Secrets.key();
    const result = Secrets.encryptFile(root, secretsKey);
    if (!result.ok) {
      return Run.fail(result.error);
    }

    Console.logLine(``);
    Console.logLine(`💾 Save to GitHub as ${Terminal.cyan(`SECRETS_KEY`)}: ${Terminal.yellow(secretsKey)}`);
    Console.logLine(``);

    return 0;
  },
};
