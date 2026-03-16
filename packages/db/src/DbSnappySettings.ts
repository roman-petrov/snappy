import type { SnappyLength, SnappyOptions, SnappyStyle } from "@snappy/domain";

import type { PrismaClient } from "./generated/client";

import { DbTools } from "./core";

export type DbSnappySettings = {
  addEmoji: boolean;
  addFormatting: boolean;
  lastReset: number;
  length: SnappyLength;
  requestCount: number;
  style: SnappyStyle;
  userId: number;
};

export const DbSnappySettings = (prisma: PrismaClient) => {
  const parseLength = (value: string): SnappyLength => (value === `extend` || value === `shorten` ? value : `keep`);

  const parseStyle = (value: string): SnappyStyle =>
    value === `business` || value === `friendly` || value === `humorous` || value === `selling` ? value : `neutral`;

  const parse = (row: {
    addEmoji: boolean;
    addFormatting: boolean;
    lastReset: Date;
    length: string;
    requestCount: number;
    style: string;
    userId: number;
  }) => ({
    addEmoji: row.addEmoji,
    addFormatting: row.addFormatting,
    lastReset: row.lastReset.getTime(),
    length: parseLength(row.length),
    requestCount: row.requestCount,
    style: parseStyle(row.style),
    userId: row.userId,
  });

  const findByUserId = async (userId: number) =>
    DbTools.parseNullable(await prisma.snappySettings.findUnique({ where: { userId } }), parse);

  const upsertWithReset = async (userId: number, lastReset: number, requestCount: number) =>
    parse(
      await prisma.snappySettings.upsert({
        create: { lastReset: new Date(lastReset), requestCount, userId },
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
      options,
      requestCount,
    }: { incrementOnUpdate: boolean; lastReset: number; options: SnappyOptions; requestCount: number },
  ) =>
    parse(
      await prisma.snappySettings.upsert({
        create: { ...options, lastReset: new Date(lastReset), requestCount, userId },
        update: incrementOnUpdate
          ? { ...options, lastReset: new Date(lastReset), requestCount: { increment: 1 } }
          : { ...options, lastReset: new Date(lastReset) },
        where: { userId },
      }),
    );

  return { findByUserId, resetCounter, upsert, upsertWithReset };
};
