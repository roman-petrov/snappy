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
  const dbUser = dbUserFromId(db, session?.user.id);
  const log = AppLog({ email: session?.user.email, userId: session?.user.id });

  return { dbUser, log };
};

const resolve = async (betterAuth: BetterAuth, incoming: IncomingHttpHeaders, db: Db) => {
  const { dbUser, log } = await context(betterAuth, incoming, db);

  return dbUser === undefined ? undefined : { dbUser, log };
};

export const Session = { context, dbUserFromId, headers, resolve };
