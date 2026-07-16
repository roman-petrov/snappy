import type { Db } from "@snappy/db";
import type { IncomingHttpHeaders } from "node:http";

import { _ } from "@snappy/core";
import { fromNodeHeaders } from "better-auth/node";

import type { BetterAuth } from "./BetterAuth";

import { AppLog } from "./AppLog";

const headers = (incoming: IncomingHttpHeaders) =>
  fromNodeHeaders(_.filterEntries(incoming, key => !key.startsWith(`:`)));

const dbUserFromId = (db: Db, id: string | undefined) => (id === undefined || id === `` ? undefined : db.user(id));

const context = async (betterAuth: BetterAuth, incoming: IncomingHttpHeaders, db: Db) => {
  const session = await betterAuth.api.getSession({ headers: headers(incoming) });
  if (session === null) {
    return undefined;
  }
  const { email, id } = session.user;
  const dbUser = db.user(id);
  const log = AppLog({ email, userId: id });

  return { dbUser, email, log };
};

const resolve = async (betterAuth: BetterAuth, incoming: IncomingHttpHeaders, db: Db) => {
  const contextValue = await context(betterAuth, incoming, db);

  return contextValue === undefined ? undefined : { dbUser: contextValue.dbUser, log: contextValue.log };
};

export const Session = { context, dbUserFromId, headers, resolve };
