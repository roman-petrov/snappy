/* eslint-disable functional/no-promise-reject */
import { initTRPC, TRPCError } from "@trpc/server";

export const TrpcContext = initTRPC.context<{ api: unknown; userId?: string }>().create();

export const TrpcAuth = TrpcContext.procedure.use(
  TrpcContext.middleware(async ({ ctx, next }) => {
    const { api, userId } = ctx;
    if (userId === undefined) {
      throw new TRPCError({ code: `UNAUTHORIZED` });
    }

    return next({ ctx: { api, userId } });
  }),
);
