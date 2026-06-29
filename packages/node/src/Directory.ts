/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable unicorn/prevent-abbreviations */
import { mkdirSync, rmSync } from "node:fs";
import { mkdir, mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ensure = (path: string) => mkdirSync(path, { recursive: true });
const remove = (path: string, { force = true, recursive = true } = {}) => rmSync(path, { force, recursive });
const ensureAsync = async (path: string) => mkdir(path, { recursive: true });
const removeAsync = async (path: string, { force = true, recursive = true } = {}) => rm(path, { force, recursive });
const entries = async (path: string) => readdir(path, { withFileTypes: true });
const temp = async (prefix: string) => mkdtemp(join(tmpdir(), prefix));
const cleanup = async (path: string) => removeAsync(path).catch(() => undefined);

const withTemp = async <T>(run: (path: string) => Promise<T> | T, prefix = `snappy-`): Promise<T> => {
  const path = await temp(prefix);
  try {
    return await run(path);
  } finally {
    await cleanup(path);
  }
};

export const Directory = { async: { ensure: ensureAsync, entries, remove: removeAsync }, ensure, remove, withTemp };
