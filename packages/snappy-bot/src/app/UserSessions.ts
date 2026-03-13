/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
import type { SnappyCoreOptions } from "@snappy/snappy-core";

import { _ } from "@snappy/core";

export type UserSession = { options: SnappyCoreOptions; text: string };

export const UserSessions = () => {
  const sessions = new Map<number, UserSession>();
  const maxCount = 1000;

  const set = (userId: number, session: UserSession) => {
    sessions.set(userId, session);
  };

  const get = (userId: number) => sessions.get(userId);

  const clear = (userId: number) => {
    sessions.delete(userId);
  };

  const cleanup = () => {
    if (sessions.size > maxCount) {
      sessions.clear();
    }
  };

  setInterval(cleanup, _.hour);

  return { clear, get, set };
};

export type UserSessionsType = ReturnType<typeof UserSessions>;
