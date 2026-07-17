/* eslint-disable @typescript-eslint/no-namespace */
import type { RpcClient, RpcInput, RpcOutput } from "../Types";

import { type ApiOf, Endpoint } from "../Endpoint";
import { Procedure } from "../Procedure";

const Rpc = { define: Endpoint.define, scope: Procedure.scope };

namespace Rpc {
  export type Client<TContract extends { modules?: object }> = RpcClient<ApiOf<TContract>>;

  export type Input<TContract extends { modules?: object }> = RpcInput<ApiOf<TContract>>;

  export type Output<TContract extends { modules?: object }> = RpcOutput<ApiOf<TContract>>;
}

export { Rpc };
