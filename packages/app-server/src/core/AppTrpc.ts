import type { DbUser } from "@snappy/db";

import { Trpc } from "@snappy/server-module";

export const AppTrpcContext = Trpc.context<{ dbUser?: DbUser }>();

export const AppTrpcAuth = Trpc.auth(AppTrpcContext, context => {
  const { dbUser } = context;

  return dbUser === undefined ? undefined : { dbUser };
});
