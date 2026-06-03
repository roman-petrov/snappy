/* eslint-disable functional/no-expression-statements */
import { z } from "zod";

import { AdminSession } from "./AdminSession";
import { AdminTrpcContext } from "./AdminTrpc";

const signIn = AdminTrpcContext.procedure
  .input(z.object({ password: z.string(), username: z.string() }))
  .mutation(({ ctx, input }) => {
    if (!AdminSession.credentialsMatch(input.username, input.password)) {
      return { status: `invalidCredentials` as const };
    }
    ctx.setSessionCookie(AdminSession.issue());

    return { status: `ok` as const };
  });

const signOut = AdminTrpcContext.procedure.mutation(({ ctx }) => {
  ctx.clearSessionCookie();

  return { ok: true as const };
});

const session = AdminTrpcContext.procedure.query(({ ctx }) => ({ ok: ctx.admin === true }));

export const AdminAuth = { trpc: { session, signIn, signOut } };

export type AdminAuth = typeof AdminAuth;
