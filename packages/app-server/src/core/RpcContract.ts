import type { DbUser } from "@snappy/db";

import { Rpc } from "@snappy/rpc/contract";

import type { AppLog } from "./AppLog";
import type { Balance } from "./Balance";
import type { BalancePayment } from "./BalancePayment";
import type { Feed } from "./Feed";
import type { SharedConfig } from "./SharedConfig";
import type { UserSettings } from "./UserSettings";

export type RpcContext = { dbUser: DbUser; email: string; log: AppLog };

export const RpcScope = Rpc.scope((context: RpcContext) => context);

export type RpcScope = typeof RpcScope;

export const RpcContract = Rpc.define<{
  balance: Balance;
  billing: BalancePayment;
  config: SharedConfig;
  feed: Feed;
  settings: UserSettings;
}>()({
  path: `/api/rpc`,
  sync: { docs: { balance: `read`, config: `read`, settings: `readWrite` }, lists: { feed: 20 } },
});

export type RpcClient = Rpc.Client<typeof RpcContract>;

export type RpcInput = Rpc.Input<typeof RpcContract>;

export type RpcOutput = Rpc.Output<typeof RpcContract>;
