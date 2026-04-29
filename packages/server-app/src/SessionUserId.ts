import type { IncomingHttpHeaders } from "node:http";

import { fromNodeHeaders } from "better-auth/node";

import type { ServerApp } from "./ServerApp";

export const SessionUserId = async (api: ServerApp, headers: IncomingHttpHeaders) => {
  const session = await api.betterAuth.api.getSession({ headers: fromNodeHeaders(headers) });
  const id = session?.user.id;

  return id === undefined || id === `` ? undefined : id;
};
