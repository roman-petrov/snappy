import type { DbUser } from "@snappy/db";

import { Rpc } from "@snappy/rpc/contract";

import type { Balance } from "./Balance";
import type { BalancePayment } from "./BalancePayment";
import type { Feed } from "./Feed";
import type { UserSettings } from "./UserSettings";

export type RpcContext = { dbUser: DbUser | undefined };

export const RpcScope = Rpc.scope(({ dbUser }: RpcContext) => (dbUser === undefined ? undefined : { dbUser }));

export type RpcScope = typeof RpcScope;

export const RpcContract = Rpc.define<{
  balance: Balance;
  billing: BalancePayment;
  feed: Feed;
  settings: UserSettings;
}>()({ path: `/api/rpc`, sync: { docs: { balance: `read`, settings: `readWrite` }, lists: { feed: 20 } } });

export type RpcClient = Rpc.Client<typeof RpcContract>;

export type RpcInput = Rpc.Input<typeof RpcContract>;

export type RpcOutput = Rpc.Output<typeof RpcContract>;
