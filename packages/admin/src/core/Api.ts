import type { TrpcRouter } from "@snappy/admin-server-api";

import { TrpcClient } from "@snappy/ui";

export const trpc = TrpcClient<TrpcRouter>(`/api/admin/trpc`);
