// cspell:word aitunnel
/* eslint-disable require-atomic-updates */
/* eslint-disable init-declarations */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { FastifyInstance, FastifyRequest } from "fastify";
import type { IncomingHttpHeaders } from "node:http";
import type { IncomingHttpHeaders as Http2IncomingHttpHeaders } from "node:http2";

import httpProxy from "@fastify/http-proxy";
import { Config } from "@snappy/config";
import { HttpStatus } from "@snappy/core";
import { type Readable, Transform } from "node:stream";
import { z } from "zod";

import type { ServerApp } from "./ServerApp";

import { SessionUserId } from "./SessionUserId";

export const AiTunnelProxy = async (app: FastifyInstance, api: ServerApp) => {
  type RequestAuthenticated = FastifyRequest & { userId: string };

  const upstreamHost = `api.aitunnel.ru`;

  await app.register(httpProxy, {
    prefix: `/api/ai-tunnel`,
    preHandler: async (request, reply) => {
      const userId = await SessionUserId(api, request.headers);
      if (userId === undefined) {
        return reply.status(HttpStatus.unauthorized).send({ status: `unauthorized` });
      }
      (request as RequestAuthenticated).userId = userId;
      if (await api.balance.isLlmBlocked(userId)) {
        return reply.status(HttpStatus.ok).send({ status: `balanceBlocked` });
      }

      return undefined;
    },
    proxyPayloads: false,
    replyOptions: {
      onResponse: (request, reply, upstreamResponse) => {
        const { headers: upstreamHeaderList, stream } = upstreamResponse as unknown as {
          headers: Http2IncomingHttpHeaders | IncomingHttpHeaders;
          stream: null | Readable | undefined;
        };

        const contentType = upstreamHeaderList[`content-type`] ?? ``;
        const { userId } = request as RequestAuthenticated;

        if (stream === undefined || stream === null) {
          void reply.send();

          return;
        }

        const debitIfUsage = async (payload: unknown) => {
          const parsed = z
            .object({ model: z.string().optional(), usage: z.object({ cost_rub: z.number() }) })
            .safeParse(payload);
          if (!parsed.success) {
            return false;
          }
          const { model, usage } = parsed.data;
          await api.balance.debitForLlm(userId, usage.cost_rub, { call: request.url, model: model ?? `` });

          return true;
        };

        if (contentType.includes(`text/event-stream`)) {
          const decoder = new TextDecoder();
          let carry = ``;
          let billingDone = false;

          const tryDebitLine = async (line: string) => {
            if (!line.startsWith(`data: `)) {
              return;
            }
            const raw = line.slice(`data: `.length).trim();
            if (raw === `[DONE]` || raw === ``) {
              return;
            }
            try {
              const payload = JSON.parse(raw) as unknown;
              if (!billingDone && (await debitIfUsage(payload))) {
                billingDone = true;
              }
            } catch {
              /* Non-JSON chunk */
            }
          };

          const passThroughForBilling = new Transform({
            flush(callback) {
              carry += decoder.decode(new Uint8Array(), { stream: false });
              if (carry !== ``) {
                void tryDebitLine(carry);
              }
              callback();
            },
            transform(chunk: Buffer, _encoding, callback) {
              carry += decoder.decode(chunk, { stream: true });
              const lines = carry.split(`\n`);
              carry = lines.at(-1) ?? ``;
              for (const line of lines.slice(0, -1)) {
                void tryDebitLine(line);
              }
              callback(undefined, chunk);
            },
          });

          stream.once(`error`, (error: Error) => passThroughForBilling.destroy(error));
          stream.pipe(passThroughForBilling);
          reply.send(passThroughForBilling);

          return;
        }

        const chunks: Buffer[] = [];
        stream.on(`data`, (chunk: Buffer | string) => chunks.push(Buffer.from(chunk)));
        stream.once(`end`, () => {
          const finishBody = async () => {
            const raw = Buffer.concat(chunks);
            let parsed: unknown;
            try {
              parsed = JSON.parse(raw.toString()) as unknown;
            } catch {
              await reply.send(raw);

              return;
            }
            await debitIfUsage(parsed);
            await reply.send(parsed);
          };

          void finishBody();
        });
        stream.once(`error`, async () => reply.status(HttpStatus.badGateway).send({ status: `upstreamError` }));
      },
      rewriteRequestHeaders: (_request, headers) => {
        const { cookie, host, ...rest } = headers;
        void cookie;
        void host;

        return { ...rest, authorization: `Bearer ${Config.aiTunnelKey}`, host: upstreamHost };
      },
    },
    upstream: `https://${upstreamHost}`,
  });
};
