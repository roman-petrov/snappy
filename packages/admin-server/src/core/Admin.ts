/* eslint-disable functional/no-expression-statements */
import type { FastifyInstance } from "fastify";

import { Config } from "@snappy/config";
import { Db } from "@snappy/db";
import { Trpc } from "@snappy/server-module";

import { AdminAuth } from "./AdminAuth";
import { AdminSession } from "./AdminSession";
import { TrpcRouter } from "./TrpcRouter";
import { Users } from "./Users";

export type AdminConfig = { app: FastifyInstance };

export const Admin = async ({ app }: AdminConfig) => {
  const db = Db(Config.dbUrl());
  const users = Users({ db });

  await Trpc.register({
    app,
    context: ({ req, res }) => ({
      admin: AdminSession.verify(req.headers.cookie) ? true : undefined,
      clearSessionCookie: () => AdminSession.clear(res),
      setSessionCookie: (token: string) => AdminSession.apply(res, token),
    }),
    prefix: `/api/admin/trpc`,
    router: TrpcRouter({ auth: AdminAuth, users }),
  });
};
