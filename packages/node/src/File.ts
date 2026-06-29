/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import {
  chmodSync,
  copyFileSync,
  createReadStream,
  existsSync,
  readFileSync,
  type ReadStream,
  writeFileSync,
} from "node:fs";
import { access, chmod, readFile, rename, stat, writeFile } from "node:fs/promises";

const mode = 0o666;

const writableSync = (path: string) => {
  if (existsSync(path)) {
    chmodSync(path, mode);
  }
};

const writable = async (path: string) => {
  try {
    await access(path);
    await chmod(path, mode);
  } catch {
    // Missing file
  }
};

const read = (path: string) => readFileSync(path, `utf8`);
const bytes = (path: string) => readFileSync(path);

const write = (path: string, data: Buffer | string) => {
  writableSync(path);
  writeFileSync(path, data);
};

const copy = (from: string, to: string) => copyFileSync(from, to);
const stream = (path: string): ReadStream => createReadStream(path);
const readAsync = async (path: string) => readFile(path, `utf8`);
const bytesAsync = async (path: string) => readFile(path);

const writeAsync = async (path: string, data: Buffer | string) => {
  await writable(path);
  await writeFile(path, data);
};

export const File = {
  async: { access, bytes: bytesAsync, read: readAsync, rename, stat, write: writeAsync },
  bytes,
  copy,
  exists: existsSync,
  read,
  stream,
  write,
};
