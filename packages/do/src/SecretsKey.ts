/* eslint-disable functional/no-expression-statements */
import type { SecretsResult } from "@snappy/config";

import { Console, Prompt } from "@snappy/node";

const prompt = async (): Promise<SecretsResult<string>> => {
  Console.logLine(``);
  const value = (await Prompt.text(`Secrets key: `)).trim();
  Console.logLine(``);

  return value === `` ? { error: `Secrets key is required.`, ok: false } : { ok: true, value };
};

export const SecretsKey = { prompt };
