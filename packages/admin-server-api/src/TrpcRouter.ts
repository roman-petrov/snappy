import { type ServerAdmin, AdminTrpcContext as t } from "@snappy/admin-server";

export const TrpcRouter = (api: ServerAdmin) => t.router({ users: t.router(api.users.trpc) });

export type TrpcRouter = ReturnType<typeof TrpcRouter>;
