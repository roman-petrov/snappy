import type { Locale } from '../locales/index';
import { config } from '../config';

interface UserSession {
  language: Locale;
  requestCount: number;
  lastReset: number;
}

// Простое in-memory хранилище для текущих сессий
const sessions = new Map<number, UserSession>();

const RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 часа

export const getUserLanguage = (userId: number): Locale => {
  const session = sessions.get(userId);
  return session?.language ?? config.DEFAULT_LANGUAGE;
};

export const setUserLanguage = (userId: number, language: Locale): void => {
  const session = sessions.get(userId) || {
    language,
    requestCount: 0,
    lastReset: Date.now(),
  };

  session.language = language;
  sessions.set(userId, session);
};

export const canMakeRequest = (userId: number): boolean => {
  const session = sessions.get(userId);

  if (!session) {
    // Первый запрос - создаем сессию
    sessions.set(userId, {
      language: config.DEFAULT_LANGUAGE,
      requestCount: 0,
      lastReset: Date.now(),
    });
    return true;
  }

  // Проверяем, нужно ли сбросить счетчик (прошло 24 часа)
  if (Date.now() - session.lastReset > RESET_INTERVAL) {
    session.requestCount = 0;
    session.lastReset = Date.now();
  }

  return session.requestCount < config.FREE_REQUESTS_LIMIT;
};

export const incrementRequestCount = (userId: number): void => {
  const session = sessions.get(userId);

  if (!session) {
    sessions.set(userId, {
      language: config.DEFAULT_LANGUAGE,
      requestCount: 1,
      lastReset: Date.now(),
    });
    return;
  }

  session.requestCount++;
};

export const getRemainingRequests = (userId: number): number => {
  const session = sessions.get(userId);

  if (!session) {
    return config.FREE_REQUESTS_LIMIT;
  }

  // Проверяем, нужно ли сбросить счетчик
  if (Date.now() - session.lastReset > RESET_INTERVAL) {
    return config.FREE_REQUESTS_LIMIT;
  }

  return Math.max(0, config.FREE_REQUESTS_LIMIT - session.requestCount);
};

// Очистка старых сессий (запускается периодически)
export const cleanupOldSessions = (): void => {
  const now = Date.now();
  const sessionsToDelete: number[] = [];

  for (const [userId, session] of sessions.entries()) {
    // Удаляем сессии старше 7 дней
    if (now - session.lastReset > 7 * 24 * 60 * 60 * 1000) {
      sessionsToDelete.push(userId);
    }
  }

  for (const userId of sessionsToDelete) {
    sessions.delete(userId);
  }
};

// Запускаем очистку каждый час
setInterval(cleanupOldSessions, 60 * 60 * 1000);
