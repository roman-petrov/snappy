import type { Db } from "@snappy/db";

import type { FileStorage } from "./FileStorage";

export const Files = ({ fileStorage, storedFile }: { fileStorage: FileStorage; storedFile: Db[`storedFile`] }) => {
  const read = async (userId: number, fileId: string) => {
    const row = await storedFile.byIdForUser(fileId, userId);
    if (row === null) {
      return { status: `notFound` as const };
    }
    const buffer = await fileStorage.readBytes(row.storageKey);

    return { buffer, mime: row.mime, status: `ok` as const };
  };

  return { read };
};

export type Files = ReturnType<typeof Files>;
