import { Trpc } from "@snappy/server-module";

export const AppTrpcContext = Trpc.context<{ userId?: string }>();

export const AppTrpcAuth = Trpc.auth(AppTrpcContext, context => {
  const { userId } = context;

  return userId === undefined ? undefined : { userId };
});
