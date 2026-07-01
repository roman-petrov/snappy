import type { TrpcClient } from "@snappy/app-server-api";

import { Store } from "@snappy/core";
import { DataHook } from "@snappy/store";

export const Balance = (trpc: TrpcClient) => {
  const $store = Store<number | undefined>(undefined);
  const load = async () => $store.set(await trpc.user.balance.query());
  const clear = () => $store.set(undefined);
  const paymentUrl = async (amount: number) => trpc.balance.paymentUrl.mutate({ amount });
  const balance = DataHook($store, value => ({ balance: value, paymentUrl }));

  return { balance, clear, load };
};
