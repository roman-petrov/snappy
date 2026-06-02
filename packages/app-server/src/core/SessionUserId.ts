import type { IncomingHttpHeaders } from "node:http";

import { fromNodeHeaders } from "better-auth/node";

import type { BetterAuth } from "./BetterAuth";

export const SessionUserId = async (betterAuth: BetterAuth, headers: IncomingHttpHeaders) => {
  const session = await betterAuth.api.getSession({ headers: fromNodeHeaders(headers) });
  const id = session?.user.id;

  return id === undefined || id === `` ? undefined : id;
};
