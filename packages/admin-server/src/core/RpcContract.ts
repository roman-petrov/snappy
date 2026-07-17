import { Rpc } from "@snappy/rpc/contract";

import type { Auth } from "./Auth";
import type { Users } from "./Users";

export type RpcContext = { admin: true | undefined };

export const RpcScope = Rpc.scope(({ admin }: RpcContext) => (admin === true ? { admin: true as const } : undefined));

export type RpcScope = typeof RpcScope;

export const RpcContract = Rpc.define<{ auth: Auth; users: Users }>()({
  path: `/api/admin/rpc`,
  sync: { lists: { users: true } },
});

export type RpcClient = Rpc.Client<typeof RpcContract>;

export type RpcInput = Rpc.Input<typeof RpcContract>;

export type RpcOutput = Rpc.Output<typeof RpcContract>;
