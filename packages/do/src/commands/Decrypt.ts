/* eslint-disable functional/no-expression-statements */
import { Secrets } from "@snappy/config";
import { Console, Prompt } from "@snappy/node";

import type { Command } from "../Command";

import { Run } from "../Run";

export const Decrypt: Command = {
  description: `Decrypt secrets.prod.enc.yaml to secrets.prod.yaml.`,
  interactive: true,
  label: `📤 Decrypt prod secrets`,
  name: `decrypt`,
  run: async root => {
    Console.logLine(``);
    const value = (await Prompt.text(`Secrets key: `)).trim();
    Console.logLine(``);
    if (value === ``) {
      return Run.fail(`Secrets key is required.`);
    }

    const result = Secrets.decryptFile(root, value);
    if (!result.ok) {
      return Run.fail(result.error);
    }

    return 0;
  },
};
