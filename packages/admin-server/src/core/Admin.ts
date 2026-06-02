/* eslint-disable functional/no-expression-statements */
import type { FastifyInstance } from "fastify";

import { TrpcRouter } from "@snappy/admin-server-api";
import { Config } from "@snappy/config";
import { _, HttpStatus } from "@snappy/core";
import { Db, DbUsers } from "@snappy/db";
import { Trpc } from "@snappy/server-module";

import { AdminSession } from "./AdminSession";
import { Users } from "./Users";

export type AdminConfig = { app: FastifyInstance };

export const Admin = async ({ app }: AdminConfig) => {
  const pageSize = 20;

  const isRecord = (value: unknown): value is Record<string, unknown> =>
    value !== null && _.isObject(value) && !_.isArray(value);

  const loginField = (body: unknown, key: `password` | `username`) => {
    if (!isRecord(body) || !(key in body)) {
      return ``;
    }
    const value = body[key];

    return _.isString(value) ? value : ``;
  };

  const db = Db(Config.dbUrl);
  const dbUsers = DbUsers(db.prisma);
  const users = Users({ dbUsers, pageSize });
  const session = (cookie?: string) => AdminSession.verify(cookie);

  app.post(`/api/admin/auth/login`, async (request, reply) => {
    const username = loginField(request.body, `username`);
    const password = loginField(request.body, `password`);
    if (!AdminSession.credentialsMatch(username, password)) {
      await reply.status(HttpStatus.unauthorized).send({ ok: false });

      return;
    }
    reply.header(`Set-Cookie`, AdminSession.setCookie(AdminSession.issue()));
    await reply.status(HttpStatus.ok).send({ ok: true });
  });

  app.post(`/api/admin/auth/logout`, async (_request, reply) => {
    reply.header(`Set-Cookie`, AdminSession.clearCookie());
    await reply.status(HttpStatus.ok).send({ ok: true });
  });

  app.get(`/api/admin/auth/session`, async (request, reply) => {
    if (!session(request.headers.cookie)) {
      await reply.status(HttpStatus.unauthorized).send({ ok: false });

      return;
    }
    await reply.status(HttpStatus.ok).send({ ok: true });
  });

  await Trpc.register({
    app,
    context: ({ req }) => ({ admin: session(req.headers.cookie) ? true : undefined }),
    prefix: `/api/admin/trpc`,
    router: TrpcRouter({ users }),
  });
};
