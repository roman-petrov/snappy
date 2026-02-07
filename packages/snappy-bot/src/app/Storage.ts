/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statements */
import { Time } from "@snappy/core";

type UserSession = { lastReset: number; requestCount: number };

export const Storage = () => {
  const sessions = new Map<number, UserSession>();
  const userTexts = new Map<number, string>();
  const resetInterval = Time.dayInMs;

  const canMakeRequest = (userId: number, freeRequestLimit: number): boolean => {
    const session = sessions.get(userId);

    if (session === undefined) {
      sessions.set(userId, { lastReset: Date.now(), requestCount: 0 });

      return true;
    }

    if (Date.now() - session.lastReset > resetInterval) {
      session.requestCount = 0;
      session.lastReset = Date.now();
    }

    return session.requestCount < freeRequestLimit;
  };

  const incrementRequestCount = (userId: number): void => {
    const session = sessions.get(userId);

    if (session === undefined) {
      sessions.set(userId, { lastReset: Date.now(), requestCount: 1 });

      return;
    }

    session.requestCount += 1;
  };

  const remainingRequests = (userId: number, freeRequestLimit: number): number => {
    const session = sessions.get(userId);

    if (session === undefined) {
      return freeRequestLimit;
    }

    if (Date.now() - session.lastReset > resetInterval) {
      return freeRequestLimit;
    }

    return Math.max(0, freeRequestLimit - session.requestCount);
  };

  const daysToKeepSession = 7;
  const sessionRetentionMs = daysToKeepSession * Time.dayInMs;

  const cleanupOldSessions = (): void => {
    const now = Date.now();
    const sessionsToDelete: number[] = [];

    for (const [userId, session] of sessions.entries()) {
      if (now - session.lastReset > sessionRetentionMs) {
        sessionsToDelete.push(userId);
      }
    }

    for (const userId of sessionsToDelete) {
      sessions.delete(userId);
    }
  };

  const setUserText = (userId: number, text: string) => {
    userTexts.set(userId, text);
  };

  const userText = (userId: number) => userTexts.get(userId);

  const clearUserText = (userId: number) => {
    userTexts.delete(userId);
  };

  const maxTextCount = 1000;

  const cleanupOldTexts = (): void => {
    if (userTexts.size > maxTextCount) {
      userTexts.clear();
    }
  };

  setInterval(cleanupOldSessions, Time.hourInMs);
  setInterval(cleanupOldTexts, Time.hourInMs);

  return { canMakeRequest, clearUserText, incrementRequestCount, remainingRequests, setUserText, userText };
};

export type Storage = ReturnType<typeof Storage>;
