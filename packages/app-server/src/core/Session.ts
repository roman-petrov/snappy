import type { Db } from "@snappy/db";
import type { IncomingHttpHeaders } from "node:http";

import { fromNodeHeaders } from "better-auth/node";

import type { BetterAuth } from "./BetterAuth";

const dbUserFromId = (db: Db, id: string | undefined) => (id === undefined || id === `` ? undefined : db.user(id));

const dbUser = async (betterAuth: BetterAuth, headers: IncomingHttpHeaders, db: Db) => {
  const session = await betterAuth.api.getSession({ headers: fromNodeHeaders(headers) });
  const id = session?.user.id;

  return dbUserFromId(db, id);
};

export const Session = { dbUser, dbUserFromId };
