/* eslint-disable functional/no-expression-statements */
import type { FastifyInstance } from "fastify";

import { Config } from "@snappy/config";
import { Db } from "@snappy/db";
import { Rpc } from "@snappy/rpc/server";

import { Auth } from "./Auth";
import { RpcContract } from "./RpcContract";
import { Session } from "./Session";
import { Users } from "./Users";

export type AppConfig = { app: FastifyInstance };

export const App = async ({ app }: AppConfig) => {
  const room = `admin`;
  const db = Db(Config.dbUrl());
  const auth = Auth();

  auth.registerHttp(app);

  await Rpc.mount(app, RpcContract, {
    context: ({ req }) => ({ admin: Session.verify(req.headers.cookie) ? (true as const) : undefined }),
    modules: { auth, users: Users({ db, room }) },
    userId: () => room,
  });
};
