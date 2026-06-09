/* eslint-disable unicorn/try-complexity */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { FastifyInstance } from "fastify";
import type { IncomingHttpHeaders } from "node:http";
import type { IncomingHttpHeaders as Http2IncomingHttpHeaders } from "node:http2";

import httpProxy, { type FastifyHttpProxyOptions } from "@fastify/http-proxy";
import { _, HttpStatus } from "@snappy/core";
import { type Readable, Transform } from "node:stream";
import { gunzipSync, zstdDecompressSync } from "node:zlib";

export type PayloadProxyConfig = {
  gate?: (headers: PayloadProxyHeaders) => PayloadProxyGateResult | Promise<PayloadProxyGateResult>;
  headers?: (outgoing: PayloadProxyHeaders) => PayloadProxyHeaders;
  onPayload: (payload: unknown, path: string, state?: PayloadProxyState) => void;
  prefix: string;
  upstream: string;
};

export type PayloadProxyGateResult =
  | { allow: false; body: unknown; status: number }
  | { allow: true; state?: PayloadProxyState };

export type PayloadProxyHeaders = Record<string, string | string[] | undefined>;

export type PayloadProxyState = Record<string, unknown>;

export const PayloadProxy = async (
  app: FastifyInstance,
  { gate, headers, onPayload, prefix, upstream }: PayloadProxyConfig,
) => {
  const stateByRequest = new WeakMap<object, PayloadProxyState>();

  await app.register(httpProxy, {
    prefix,
    ...(gate === undefined
      ? {}
      : {
          preHandler: async (request, reply) => {
            const result = await gate(request.headers);
            if (!result.allow) {
              return reply.status(result.status).send(result.body);
            }
            if (result.state !== undefined) {
              stateByRequest.set(request, result.state);
            }

            return undefined;
          },
        }),
    proxyPayloads: false,
    replyOptions: {
      onResponse: (request, reply, upstreamResponse) => {
        const { headers: upstreamHeaders, stream } = upstreamResponse as unknown as {
          headers: Http2IncomingHttpHeaders | IncomingHttpHeaders;
          stream: null | Readable | undefined;
        };

        const path = request.url;
        const state = stateByRequest.get(request);

        if (stream === undefined || stream === null) {
          void reply.send();

          return;
        }

        if ((upstreamHeaders[`content-type`] ?? ``).includes(`text/event-stream`)) {
          const decoder = new TextDecoder();
          let carry = ``;

          const emitLine = (line: string) => {
            if (!line.startsWith(`data: `)) {
              return;
            }
            const raw = line.slice(`data: `.length).trim();
            if (raw === `[DONE]` || raw === ``) {
              return;
            }
            try {
              onPayload(JSON.parse(raw) as unknown, path, stateByRequest.get(request));
            } catch {
              /* Non-JSON chunk */
            }
          };

          const passThrough = new Transform({
            flush(callback) {
              carry += decoder.decode(new Uint8Array(), { stream: false });
              if (carry !== ``) {
                emitLine(carry);
              }
              callback();
            },
            transform(chunk: Buffer, _encoding, callback) {
              carry += decoder.decode(chunk, { stream: true });
              const lines = carry.split(`\n`);
              carry = lines.at(-1) ?? ``;
              for (const line of lines.slice(0, -1)) {
                emitLine(line);
              }
              callback(undefined, chunk);
            },
          });

          stream.once(`error`, (error: Error) => passThrough.destroy(error));
          stream.pipe(passThrough);
          reply.send(passThrough);

          return;
        }

        const chunks: Buffer[] = [];
        stream.on(`data`, (chunk: Buffer | string) => chunks.push(Buffer.from(chunk)));
        stream.once(`end`, async () => {
          const raw = Buffer.concat(chunks);
          try {
            const encoding = upstreamHeaders[`content-encoding`];

            const decoded =
              _.isString(encoding) && encoding.includes(`zstd`)
                ? zstdDecompressSync(raw)
                : _.isString(encoding) && encoding.includes(`gzip`)
                  ? gunzipSync(raw)
                  : raw;
            onPayload(JSON.parse(decoded.toString(`utf8`)) as unknown, path, state);
            await reply.send(raw);
          } catch {
            await reply.status(HttpStatus.badGateway).send({ status: `upstreamError` });
          }
        });
        stream.once(`error`, async () => reply.status(HttpStatus.badGateway).send({ status: `upstreamError` }));
      },
      rewriteRequestHeaders: headers === undefined ? undefined : (_request, outgoing) => headers(outgoing),
    },
    upstream,
  } satisfies FastifyHttpProxyOptions);
};
