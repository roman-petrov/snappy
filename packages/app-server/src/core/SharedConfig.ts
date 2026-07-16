import { Config } from "@snappy/config";

import { RpcScope } from "./RpcContract";

export const SharedConfig = () => {
  const { doc } = RpcScope;

  const rpc = doc({ live: () => () => undefined }, () => ({
    payment: { max: Config.balance.paymentMax, min: Config.balance.paymentMin },
  }));

  return { rpc };
};

export type SharedConfig = ReturnType<typeof SharedConfig>;
