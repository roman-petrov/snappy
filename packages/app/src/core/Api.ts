import type { TrpcRouter } from "@snappy/trpc";

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

const url = `${globalThis.location.origin}/api/trpc`;

export const trpc = createTRPCProxyClient<TrpcRouter>({
  links: [httpBatchLink({ fetch: async (input, init) => fetch(input, { ...init, credentials: `include` }), url })],
});
