/* eslint-disable functional/no-promise-reject */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { FastifyInstance, FastifyRequest } from "fastify";

import { type AnyRouter, initTRPC, TRPCError } from "@trpc/server";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";

type CreatedTrpc<TContext extends object> = ReturnType<ReturnType<typeof initTRPC.context<TContext>>[`create`]>;

type RegisterInput<TRouter extends AnyRouter> = {
  app: FastifyInstance;
  context: (input: { req: FastifyRequest }) => unknown;
  prefix: string;
  router: TRouter;
};

const context = <TContext extends object>() => initTRPC.context<TContext>().create();

const auth = <TContext extends object, TAuthenticated extends object>(
  trpc: CreatedTrpc<TContext>,
  authenticate: (context_: TContext) => TAuthenticated | undefined,
) =>
  trpc.procedure.use(
    // @ts-expect-error tRPC middleware context types do not compose generically
    trpc.middleware(async ({ ctx, next }) => {
      const authenticated = authenticate(ctx as unknown as TContext);
      if (authenticated === undefined) {
        throw new TRPCError({ code: `UNAUTHORIZED` });
      }

      return next({ ctx: authenticated });
    }),
  );

const register = async <TRouter extends AnyRouter>({
  app,
  context: createContext,
  prefix,
  router,
}: RegisterInput<TRouter>) =>
  app.register(fastifyTRPCPlugin<TRouter>, { prefix, trpcOptions: { createContext, router } });

export const Trpc = { auth, context, register };
