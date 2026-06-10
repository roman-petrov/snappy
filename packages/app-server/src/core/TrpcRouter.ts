import type { ServerApp } from "./ServerApp";

import { AppTrpcContext as t } from "./AppTrpc";

export const TrpcRouter = (api: ServerApp) =>
  t.router({
    balance: t.router(api.balancePayment.trpc),
    feed: t.router(api.feed.trpc),
    user: t.router({ balance: api.balance.trpc, settings: t.router(api.userSettings.trpc) }),
  });

export type TrpcRouter = ReturnType<typeof TrpcRouter>;
