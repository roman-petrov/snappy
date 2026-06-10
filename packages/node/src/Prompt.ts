/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";

import { Terminal } from "./Terminal";

const text = async (label: string) => {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    return await rl.question(Terminal.cyan(label));
  } finally {
    rl.close();
  }
};

export const Prompt = { text };
