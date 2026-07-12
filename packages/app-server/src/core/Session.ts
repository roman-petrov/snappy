import type { Db } from "@snappy/db";
import type { IncomingHttpHeaders } from "node:http";

import { _ } from "@snappy/core";
import { fromNodeHeaders } from "better-auth/node";

import type { BetterAuth } from "./BetterAuth";

const headers = (incoming: IncomingHttpHeaders) =>
  fromNodeHeaders(_.fromEntries(_.entries(incoming).filter(([key]) => !key.startsWith(`:`))));

const dbUserFromId = (db: Db, id: string | undefined) => (id === undefined || id === `` ? undefined : db.user(id));

const dbUser = async (betterAuth: BetterAuth, incoming: IncomingHttpHeaders, db: Db) => {
  const session = await betterAuth.api.getSession({ headers: headers(incoming) });
  const id = session?.user.id;

  return dbUserFromId(db, id);
};

export const Session = { dbUser, dbUserFromId, headers };
