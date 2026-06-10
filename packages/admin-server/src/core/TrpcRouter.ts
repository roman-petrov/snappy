import type { ServerAdmin } from "./ServerAdmin";

import { AdminTrpcContext as t } from "./AdminTrpc";

export const TrpcRouter = (api: ServerAdmin) =>
  t.router({ auth: t.router(api.auth.trpc), users: t.router(api.users.trpc) });

export type TrpcRouter = ReturnType<typeof TrpcRouter>;
