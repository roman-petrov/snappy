import type { Locale } from "../locales";

import { config } from "../config";

type UserSession = { language: Locale; lastReset: number; requestCount: number };

// Простое in-memory хранилище для текущих сессий
const sessions = new Map<number, UserSession>();
const secondsPerMinute = 60;
const minutesPerHour = 60;
const millisecondsPerSecond = 1000;
const hourInMs = secondsPerMinute * minutesPerHour * millisecondsPerSecond;
const dayInMs = 24 * hourInMs;
const resetInterval = dayInMs;

export const getUserLanguage = (userId: number): Locale => {
  const session = sessions.get(userId);

  if (session === undefined) {
    return config.DEFAULT_LANGUAGE;
  }

  return session.language;
};

export const setUserLanguage = (userId: number, language: Locale): void => {
  const session = sessions.get(userId) ?? { language, lastReset: Date.now(), requestCount: 0 };

  session.language = language;
  sessions.set(userId, session);
};

export const canMakeRequest = (userId: number): boolean => {
  const session = sessions.get(userId);

  if (session === undefined) {
    // Первый запрос - создаем сессию
    sessions.set(userId, { language: config.DEFAULT_LANGUAGE, lastReset: Date.now(), requestCount: 0 });

    return true;
  }

  // Проверяем, нужно ли сбросить счетчик (прошло 24 часа)
  if (Date.now() - session.lastReset > resetInterval) {
    session.requestCount = 0;
    session.lastReset = Date.now();
  }

  return session.requestCount < config.FREE_REQUESTS_LIMIT;
};

export const incrementRequestCount = (userId: number): void => {
  const session = sessions.get(userId);

  if (session === undefined) {
    sessions.set(userId, { language: config.DEFAULT_LANGUAGE, lastReset: Date.now(), requestCount: 1 });

    return;
  }

  session.requestCount += 1;
};

export const getRemainingRequests = (userId: number): number => {
  const session = sessions.get(userId);

  if (session === undefined) {
    return config.FREE_REQUESTS_LIMIT;
  }

  // Проверяем, нужно ли сбросить счетчик
  if (Date.now() - session.lastReset > resetInterval) {
    return config.FREE_REQUESTS_LIMIT;
  }

  return Math.max(0, config.FREE_REQUESTS_LIMIT - session.requestCount);
};

// Очистка старых сессий (запускается периодически)
const daysToKeepSession = 7;
const sessionRetentionMs = daysToKeepSession * dayInMs;

export const cleanupOldSessions = (): void => {
  const now = Date.now();
  const sessionsToDelete: number[] = [];

  for (const [userId, session] of sessions.entries()) {
    // Удаляем сессии старше 7 дней
    if (now - session.lastReset > sessionRetentionMs) {
      sessionsToDelete.push(userId);
    }
  }

  for (const userId of sessionsToDelete) {
    sessions.delete(userId);
  }
};

// Запускаем очистку каждый час
setInterval(cleanupOldSessions, hourInMs);
