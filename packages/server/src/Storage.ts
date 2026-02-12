/* eslint-disable functional/no-expression-statements */
import type { Database } from "@snappy/db";

import { Time } from "@snappy/core";

const resetInterval = Time.dayInMs;
const byUserId = (userId: number) => ({ where: { userId } }) as const;
const resetData = () => ({ lastReset: new Date(), requestCount: 0 }) as const;
const needsReset = (lastReset: Date) => Date.now() - lastReset.getTime() > resetInterval;

const ensureUserByTelegramId = async (db: Database, telegramId: number, telegramUsername?: string) =>
  db.user.upsert({
    create: { telegramId, telegramUsername: telegramUsername ?? undefined },
    update: telegramUsername === undefined ? {} : { telegramUsername },
    where: { telegramId },
  });

const ensureUserByEmail = async (db: Database, email: string, passwordHash: string) =>
  db.user.create({ data: { email, passwordHash } });

const remainingByUserId = async (db: Database, userId: number, freeRequestLimit: number): Promise<number> => {
  const settings = await db.snappySettings.findUnique(byUserId(userId));

  return settings === null
    ? freeRequestLimit
    : needsReset(settings.lastReset)
      ? freeRequestLimit
      : Math.max(0, freeRequestLimit - settings.requestCount);
};

const canMakeRequestByUserId = async (db: Database, userId: number, freeRequestLimit: number): Promise<boolean> => {
  const settings = await db.snappySettings.upsert({
    create: { ...resetData(), userId },
    update: {},
    ...byUserId(userId),
  });

  if (needsReset(settings.lastReset)) {
    await db.snappySettings.update({ data: resetData(), ...byUserId(userId) });

    return true;
  }

  return settings.requestCount < freeRequestLimit;
};

const incrementRequestByUserId = async (db: Database, userId: number) => {
  await db.snappySettings.upsert({
    create: { ...resetData(), requestCount: 1, userId },
    update: { requestCount: { increment: 1 } },
    ...byUserId(userId),
  });
};

const remainingByTelegramId = async (
  db: Database,
  telegramId: number,
  freeRequestLimit: number,
  telegramUsername?: string,
): Promise<number> => {
  const user = await ensureUserByTelegramId(db, telegramId, telegramUsername);

  return remainingByUserId(db, user.id, freeRequestLimit);
};

const canMakeRequestByTelegramId = async (
  db: Database,
  telegramId: number,
  freeRequestLimit: number,
  telegramUsername?: string,
): Promise<boolean> => {
  const user = await ensureUserByTelegramId(db, telegramId, telegramUsername);

  return canMakeRequestByUserId(db, user.id, freeRequestLimit);
};

const incrementRequestByTelegramId = async (db: Database, telegramId: number, telegramUsername?: string) => {
  const user = await ensureUserByTelegramId(db, telegramId, telegramUsername);
  await incrementRequestByUserId(db, user.id);
};

export const Storage = {
  canMakeRequestByTelegramId,
  canMakeRequestByUserId,
  ensureUserByEmail,
  ensureUserByTelegramId,
  incrementRequestByTelegramId,
  incrementRequestByUserId,
  remainingByTelegramId,
  remainingByUserId,
};
