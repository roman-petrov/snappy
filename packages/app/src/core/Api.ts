import type { TrpcRouter } from "@snappy/app-server-api";

import { TrpcClient } from "@snappy/ui";

export const trpc = TrpcClient<TrpcRouter>(`/api/trpc`);
