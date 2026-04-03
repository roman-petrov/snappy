/* eslint-disable functional/no-expression-statements */

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const FileStorage = (root: string) => {
  const savePng = async (userId: number, bytes: Uint8Array) => {
    const id = randomUUID();
    const userDir = join(root, String(userId));
    await mkdir(userDir, { recursive: true });
    const fileName = `${id}.png`;
    const storageKey = `${String(userId)}/${fileName}`;
    await writeFile(join(root, String(userId), fileName), bytes);

    return { id, size: bytes.length, storageKey };
  };

  const readBytes = async (storageKey: string) => readFile(join(root, ...storageKey.split(`/`)));

  return { readBytes, root, savePng };
};

export type FileStorage = ReturnType<typeof FileStorage>;
