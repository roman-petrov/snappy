/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statements */
import type { Locale } from "../locales";

import { AppConfiguration } from "../AppConfiguration";
import { Time } from "@snappy/core";

type UserSession = { lastReset: number; requestCount: number };

const sessions = new Map<number, UserSession>();
const resetInterval = Time.dayInMs;

const userLanguage = (languageCode?: string): Locale => {
  if (languageCode === undefined) {
    return `en`;
  }

  const code = languageCode.toLowerCase();

  if (code.startsWith(`ru`)) {
    return `ru`;
  }

  if (code.startsWith(`en`)) {
    return `en`;
  }

  return `en`;
};

const canMakeRequest = (userId: number): boolean => {
  const session = sessions.get(userId);

  if (session === undefined) {
    sessions.set(userId, { lastReset: Date.now(), requestCount: 0 });

    return true;
  }

  if (Date.now() - session.lastReset > resetInterval) {
    session.requestCount = 0;
    session.lastReset = Date.now();
  }

  return session.requestCount < AppConfiguration.freeRequestLimit;
};

const incrementRequestCount = (userId: number): void => {
  const session = sessions.get(userId);

  if (session === undefined) {
    sessions.set(userId, { lastReset: Date.now(), requestCount: 1 });

    return;
  }

  session.requestCount += 1;
};

const remainingRequests = (userId: number): number => {
  const session = sessions.get(userId);

  if (session === undefined) {
    return AppConfiguration.freeRequestLimit;
  }

  if (Date.now() - session.lastReset > resetInterval) {
    return AppConfiguration.freeRequestLimit;
  }

  return Math.max(0, AppConfiguration.freeRequestLimit - session.requestCount);
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

setInterval(cleanupOldSessions, Time.hourInMs);

export const Storage = { canMakeRequest, cleanupOldSessions, incrementRequestCount, remainingRequests, userLanguage };
