import type { PrismaClient } from "./generated/client";

import { DbTools } from "./core";

export type DbSnappySettings = {
  communityImageModel: string;
  communityTextModel: string;
  lastReset: number;
  llmProvider: string;
  ollamaRelayKey: string;
  requestCount: number;
  userId: number;
};

export const DbSnappySettings = (prisma: PrismaClient) => {
  const parse = (row: {
    communityImageModel: string;
    communityTextModel: string;
    lastReset: Date;
    llmProvider: string;
    ollamaRelayKey: string;
    requestCount: number;
    userId: number;
  }) => ({
    communityImageModel: row.communityImageModel,
    communityTextModel: row.communityTextModel,
    lastReset: row.lastReset.getTime(),
    llmProvider: row.llmProvider,
    ollamaRelayKey: row.ollamaRelayKey,
    requestCount: row.requestCount,
    userId: row.userId,
  });

  const findByUserId = async (userId: number) =>
    DbTools.parseNullable(await prisma.snappySettings.findUnique({ where: { userId } }), parse);

  const upsertWithReset = async (userId: number, lastReset: number, requestCount: number) =>
    parse(
      await prisma.snappySettings.upsert({
        create: { lastReset: new Date(lastReset), ollamaRelayKey: ``, requestCount, userId },
        update: {},
        where: { userId },
      }),
    );

  const resetCounter = async (userId: number, lastReset: number) =>
    prisma.snappySettings.update({ data: { lastReset: new Date(lastReset), requestCount: 0 }, where: { userId } });

  const upsert = async (
    userId: number,
    {
      incrementOnUpdate,
      lastReset,
      requestCount,
    }: { incrementOnUpdate: boolean; lastReset: number; requestCount: number },
  ) =>
    parse(
      await prisma.snappySettings.upsert({
        create: { lastReset: new Date(lastReset), ollamaRelayKey: ``, requestCount, userId },
        update: incrementOnUpdate
          ? { lastReset: new Date(lastReset), requestCount: { increment: 1 } }
          : { lastReset: new Date(lastReset) },
        where: { userId },
      }),
    );

  const setOllamaRelayKey = async (userId: number, ollamaRelayKey: string) =>
    prisma.snappySettings.upsert({
      create: { lastReset: new Date(), ollamaRelayKey, requestCount: 0, userId },
      update: { ollamaRelayKey },
      where: { userId },
    });

  const patchRelaySettings = async (
    userId: number,
    patch: { communityImageModel: string; communityTextModel: string; llmProvider: string; ollamaRelayKey: string },
  ) =>
    prisma.snappySettings.upsert({
      create: {
        communityImageModel: patch.communityImageModel,
        communityTextModel: patch.communityTextModel,
        lastReset: new Date(),
        llmProvider: patch.llmProvider,
        ollamaRelayKey: patch.ollamaRelayKey,
        requestCount: 0,
        userId,
      },
      update: {
        communityImageModel: patch.communityImageModel,
        communityTextModel: patch.communityTextModel,
        llmProvider: patch.llmProvider,
        ollamaRelayKey: patch.ollamaRelayKey,
      },
      where: { userId },
    });

  return { findByUserId, patchRelaySettings, resetCounter, setOllamaRelayKey, upsert, upsertWithReset };
};
