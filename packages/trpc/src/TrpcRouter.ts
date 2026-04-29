import { type ServerApp, TrpcContext as t } from "@snappy/server-app";

export const TrpcRouter = (api: ServerApp) =>
  t.router({
    balance: t.router(api.balancePayment.trpc),
    user: t.router({ balance: api.balance.trpc, settings: t.router(api.userSettings.trpc) }),
  });

export type TrpcRouter = ReturnType<typeof TrpcRouter>;
