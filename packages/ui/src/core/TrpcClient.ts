import type { AnyRouter } from "@trpc/server";

import { createTRPCProxyClient, httpBatchLink, type TRPCClient } from "@trpc/client";

const createImpl = (path: string) =>
  createTRPCProxyClient<AnyRouter>({
    links: [
      httpBatchLink({
        fetch: async (input, init) => globalThis.fetch(input, { ...init, credentials: `include` }),
        url: `${globalThis.location.origin}${path}`,
      }),
    ],
  });

export const TrpcClient = createImpl as <TRouter extends AnyRouter>(path: string) => TRPCClient<TRouter>;
