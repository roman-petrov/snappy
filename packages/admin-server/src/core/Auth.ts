/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable functional/no-expression-statements */
import type { FastifyInstance } from "fastify";

import { z } from "zod";

import { RpcScope } from "./RpcContract";
import { Session } from "./Session";

export const Auth = () => {
  const signInBody = z.object({ password: z.string(), username: z.string() });
  const session = RpcScope.open(async ({ ctx }) => ({ ok: ctx.admin === true }));

  const registerHttp = (app: FastifyInstance) => {
    app.post(`/api/admin/session`, (request, reply) => {
      const parsed = signInBody.safeParse(request.body);
      if (!parsed.success) {
        return { status: `invalidCredentials` as const };
      }
      if (!Session.credentialsMatch(parsed.data.username, parsed.data.password)) {
        return { status: `invalidCredentials` as const };
      }
      Session.apply(reply, Session.issue());

      return { status: `ok` as const };
    });

    app.delete(`/api/admin/session`, (_request, reply) => {
      Session.clear(reply);

      return { ok: true as const };
    });
  };

  const rpc = { session };

  return { registerHttp, rpc };
};

export type Auth = ReturnType<typeof Auth>;
