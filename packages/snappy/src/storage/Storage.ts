/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statements */
import type { Locale } from "../locales";

import { AppConfiguration } from "../AppConfiguration";
import { Time } from "../core/Time";

type UserSession = { lastReset: number; requestCount: number };

// Простое in-memory хранилище для текущих сессий
const sessions = new Map<number, UserSession>();
const resetInterval = Time.dayInMs;

/**
 * Определяет язык на основе language_code из Telegram
 * Если язык русский - возвращает 'ru', если английский - 'en', иначе - 'en'
 * Если language_code не определен - возвращает 'en'
 */
export const getUserLanguage = (languageCode?: string): Locale => {
  if (languageCode === undefined) {
    return `en`;
  }

  const code = languageCode.toLowerCase();

  // Проверяем русский язык (ru, ru-RU и т.д.)
  if (code.startsWith(`ru`)) {
    return `ru`;
  }

  // Проверяем английский язык (en, en-US и т.д.)
  if (code.startsWith(`en`)) {
    return `en`;
  }

  // Для всех остальных языков используем английский
  return `en`;
};

export const canMakeRequest = (userId: number): boolean => {
  const session = sessions.get(userId);

  if (session === undefined) {
    // Первый запрос - создаем сессию
    sessions.set(userId, { lastReset: Date.now(), requestCount: 0 });

    return true;
  }

  // Проверяем, нужно ли сбросить счетчик (прошло 24 часа)
  if (Date.now() - session.lastReset > resetInterval) {
    session.requestCount = 0;
    session.lastReset = Date.now();
  }

  return session.requestCount < AppConfiguration.freeRequestLimit;
};

export const incrementRequestCount = (userId: number): void => {
  const session = sessions.get(userId);

  if (session === undefined) {
    sessions.set(userId, { lastReset: Date.now(), requestCount: 1 });

    return;
  }

  session.requestCount += 1;
};

export const getRemainingRequests = (userId: number): number => {
  const session = sessions.get(userId);

  if (session === undefined) {
    return AppConfiguration.freeRequestLimit;
  }

  // Проверяем, нужно ли сбросить счетчик
  if (Date.now() - session.lastReset > resetInterval) {
    return AppConfiguration.freeRequestLimit;
  }

  return Math.max(0, AppConfiguration.freeRequestLimit - session.requestCount);
};

// Очистка старых сессий (запускается периодически)
const daysToKeepSession = 7;
const sessionRetentionMs = daysToKeepSession * Time.dayInMs;

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
setInterval(cleanupOldSessions, Time.hourInMs);
