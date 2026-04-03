/* eslint-disable functional/no-expression-statements */
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const enabled = process.env.NODE_ENV === `development`;
const moduleDir = fileURLToPath(new URL(`.`, import.meta.url));
const repoRoot = join(moduleDir, `..`, `..`, `..`);
const dir = join(repoRoot, `.snappy-agent`);
const file = join(dir, `model-chat.log`);
const pretty = (value: unknown): string => JSON.stringify(value, undefined, 2);

const append = async (text: string): Promise<void> => {
  await mkdir(dir, { recursive: true });
  await appendFile(file, text, `utf8`);
};

const formatBlock = (title: string, iteration: number, request: unknown, response?: unknown): string => {
  const tail = response === undefined ? `\n--- (no response)\n` : `\n--- from model ---\n${pretty(response)}\n`;

  return [
    `\n======== ${new Date().toISOString()} ${title} iteration=${iteration} ========\n`,
    `--- to model ---\n`,
    pretty(request),
    tail,
  ].join(``);
};

const round = async (iteration: number, request: unknown, response: unknown): Promise<void> => {
  if (!enabled) {
    return;
  }
  await append(formatBlock(`chat`, iteration, request, response));
};

const failedRequest = async (iteration: number, request: unknown): Promise<void> => {
  if (!enabled) {
    return;
  }
  await append(formatBlock(`chat_error`, iteration, request, undefined));
};

export const ModelLog = { failedRequest, round };
