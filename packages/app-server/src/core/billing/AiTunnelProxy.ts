// cspell:word aitunnel
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable promise/always-return */
import type { Db, DbUser } from "@snappy/db";
import type { FastifyInstance } from "fastify";

import { Config } from "@snappy/config";
import { _, HttpStatus } from "@snappy/core";
import { Log } from "@snappy/log";
import { z } from "zod";

import type { Balance } from "../Balance";
import type { BetterAuth } from "../BetterAuth";

import { Session } from "../Session";
import { PayloadProxy } from "./PayloadProxy";

export type AiTunnelProxyConfig = {
  balance: Balance;
  betterAuth: BetterAuth;
  db: ReturnType<typeof Db>;
  upstream?: string;
};

export const AiTunnelProxy = async (
  app: FastifyInstance,
  { balance, betterAuth, db, upstream }: AiTunnelProxyConfig,
) => {
  type State = { billingDone?: boolean; dbUser: DbUser };

  const upstreamHost = `api.aitunnel.ru`;

  await PayloadProxy(app, {
    gate: async headers => {
      const dbUser = await Session.dbUser(betterAuth, headers, db);
      if (dbUser === undefined) {
        return { allow: false, body: { status: `unauthorized` }, status: HttpStatus.unauthorized };
      }
      if (await balance.isLlmBlocked(dbUser)) {
        Log.ai.warn(`ai.gate.blocked`, { userId: dbUser.id });

        return { allow: false, body: { status: `balanceBlocked` }, status: HttpStatus.ok };
      }

      return { allow: true, state: { billingDone: false, dbUser } satisfies State };
    },
    headers: outgoing => {
      const { cookie, host, ...rest } = outgoing;
      void cookie;
      void host;

      return { ...rest, authorization: `Bearer ${Config.aiTunnelKey()}`, host: upstreamHost };
    },
    onPayload: (payload, path, state) => {
      if (state === undefined || !(`dbUser` in state)) {
        return;
      }
      const tunnel = state as State;
      if (tunnel.billingDone === true) {
        return;
      }
      const parsed = z
        .object({ model: z.string().optional(), usage: z.object({ cost_rub: z.number() }) })
        .safeParse(payload);
      if (!parsed.success) {
        return;
      }
      const { model, usage } = parsed.data;
      const debit = { call: path, costRub: usage.cost_rub, model: model ?? ``, userId: tunnel.dbUser.id };
      void balance.debitForLlm(tunnel.dbUser, usage.cost_rub, { call: debit.call, model: debit.model }).then(
        () => {
          tunnel.billingDone = true;
          Log.ai.info(`ai.debit.ok`, debit);
        },
        () => Log.ai.error(`ai.debit.failed`, debit),
      );
    },
    prefix: `/api/ai-tunnel`,
    upstream: upstream ?? _.https(upstreamHost),
  });
};
