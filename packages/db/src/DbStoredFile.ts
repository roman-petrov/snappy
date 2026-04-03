/* eslint-disable unicorn/no-null */

import type { PrismaClient } from "./generated/client";

export const DbStoredFile = (prisma: PrismaClient) => {
  const create = async (input: {
    kind: string;
    mime: string;
    sessionId: string | undefined;
    size: number;
    storageKey: string;
    userId: number;
  }) =>
    prisma.storedFile.create({
      data: {
        kind: input.kind,
        mime: input.mime,
        sessionId: input.sessionId ?? null,
        size: input.size,
        storageKey: input.storageKey,
        userId: input.userId,
      },
      select: { id: true },
    });

  const byIdForUser = async (id: string, userId: number) => prisma.storedFile.findFirst({ where: { id, userId } });

  return { byIdForUser, create };
};
