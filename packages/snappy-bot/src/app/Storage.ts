/* eslint-disable functional/no-expression-statements */
import type { Database } from "@snappy/db";

import { Time } from "@snappy/core";

export const Storage = (db: Database) => {
  const resetInterval = Time.dayInMs;

  const ensureUser = async (telegramId: number, telegramUsername?: string) =>
    db.user.upsert({
      create: { telegramId, telegramUsername: telegramUsername ?? undefined },
      update: telegramUsername === undefined ? {} : { telegramUsername },
      where: { telegramId },
    });

  const byUserId = (userId: number) => ({ where: { userId } }) as const;
  const resetData = () => ({ lastReset: new Date(), requestCount: 0 }) as const;
  const needsReset = (lastReset: Date) => Date.now() - lastReset.getTime() > resetInterval;

  const canMakeRequest = async (telegramId: number, freeRequestLimit: number, telegramUsername?: string) => {
    const user = await ensureUser(telegramId, telegramUsername);

    const settings = await db.snappySettings.upsert({
      create: { ...resetData(), userId: user.id },
      update: {},
      ...byUserId(user.id),
    });

    if (needsReset(settings.lastReset)) {
      await db.snappySettings.update({ data: resetData(), ...byUserId(user.id) });

      return true;
    }

    return settings.requestCount < freeRequestLimit;
  };

  const incrementRequestCount = async (telegramId: number, telegramUsername?: string) => {
    const user = await ensureUser(telegramId, telegramUsername);
    await db.snappySettings.upsert({
      create: { ...resetData(), requestCount: 1, userId: user.id },
      update: { requestCount: { increment: 1 } },
      ...byUserId(user.id),
    });
  };

  const remainingRequests = async (telegramId: number, freeRequestLimit: number, telegramUsername?: string) => {
    const user = await ensureUser(telegramId, telegramUsername);
    const settings = await db.snappySettings.findUnique(byUserId(user.id));

    return settings === null
      ? freeRequestLimit
      : needsReset(settings.lastReset)
        ? freeRequestLimit
        : Math.max(0, freeRequestLimit - settings.requestCount);
  };

  return { canMakeRequest, incrementRequestCount, remainingRequests };
};

export type Storage = ReturnType<typeof Storage>;
