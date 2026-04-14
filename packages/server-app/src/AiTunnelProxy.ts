/* eslint-disable no-await-in-loop */
/* eslint-disable init-declarations */
/* eslint-disable unicorn/prefer-string-replace-all */
/* eslint-disable regexp/no-super-linear-move */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { FastifyReply, FastifyRequest } from "fastify";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";

import { _, HttpStatus } from "@snappy/core";
import { Readable } from "node:stream";

import type { Balance } from "./Balance";

export const AiTunnelRoute = `/api/ai-tunnel/v1` as const;

export type AiTunnelProxyConfig = { aiTunnelKey: string; balance: Balance };

export const AiTunnelProxy =
  ({ aiTunnelKey, balance }: AiTunnelProxyConfig) =>
  async (userId: string, pathTail: string, request: FastifyRequest, reply: FastifyReply) => {
    const tail = pathTail.replace(/^\/+|\/+$/gu, ``);
    const rawBody = request.body;
    const model = _.isObject(rawBody) ? ((rawBody as { model?: string }).model ?? ``) : ``;

    type Call = `chat` | `image` | `speechRecognition`;

    const debitByPayload = async (payload: unknown, call: Call) => {
      if (!_.isObject(payload) || !(`usage` in payload)) {
        return;
      }
      const { usage } = payload as { usage?: unknown };
      if (!_.isObject(usage) || !(`cost_rub` in usage)) {
        return;
      }
      const rub = (usage as { cost_rub?: unknown }).cost_rub;
      if (!_.isNumber(rub)) {
        return;
      }

      await balance.debitForLlm(userId, rub, { call, model });
    };

    const readJsonAndDebit = async (response: Response, call: Call) => {
      const json = (await response.json()) as Record<string, unknown>;
      await debitByPayload(json, call);

      return json;
    };

    const getHeaders = (response: Response) => {
      const omit = new Set([`connection`, `content-encoding`, `content-length`, `keep-alive`, `transfer-encoding`]);
      const headers = new Headers();
      for (const [key, value] of response.headers.entries()) {
        if (!omit.has(key.toLowerCase())) {
          headers.append(key, value);
        }
      }

      return Object.fromEntries(headers.entries());
    };

    const fetchWithAuth = async (body: BodyInit, headers?: HeadersInit) => {
      const auth = new Headers(headers);
      auth.set(`Authorization`, `Bearer ${aiTunnelKey}`);
      const init =
        body instanceof Readable
          ? { body, duplex: `half`, headers: auth, method: `POST` }
          : { body, headers: auth, method: `POST` };

      return fetch(`https://api.aitunnel.ru/v1/${tail}`, init);
    };

    const fetchJson = async (body: Record<string, unknown>) =>
      fetchWithAuth(JSON.stringify(body), { "Content-Type": `application/json` });

    const proxyJson = async (response: Response, call: Call) => {
      const json = await readJsonAndDebit(response, call);
      await reply.status(response.status).headers(getHeaders(response)).send(json);
    };

    const chatCompletions = async () => {
      const body = _.isObject(rawBody) ? (rawBody as Record<string, unknown> & { stream?: unknown }) : {};
      const response = await fetchJson(body);

      if (body.stream !== true || response.body === null) {
        await proxyJson(response, `chat`);

        return;
      }

      const [proxyStream, billingStream] = response.body.tee();

      const runBilling = async () => {
        const reader = billingStream.getReader();
        const decoder = new TextDecoder();
        let carry = ``;
        let billed = false;

        const billOnce = (payload: unknown) => {
          if (billed) {
            return;
          }
          billed = true;
          void debitByPayload(payload, `chat`);
        };

        const onDataLine = (line: string) => {
          if (!line.startsWith(`data: `)) {
            return;
          }
          const payload = line.slice(`data: `.length).trim();
          if (payload === `[DONE]` || payload === ``) {
            return;
          }
          let parsed: unknown;
          try {
            parsed = JSON.parse(payload);
          } catch {
            return;
          }
          billOnce(parsed);
        };

        const pushBilling = (chunk: Uint8Array) => {
          carry += decoder.decode(chunk, { stream: true });
          const lines = carry.split(`\n`);
          carry = lines.at(-1) ?? ``;
          for (const line of lines.slice(0, -1)) {
            onDataLine(line);
          }
        };

        const endBilling = () => {
          carry += decoder.decode(new Uint8Array(), { stream: false });
          if (carry !== ``) {
            onDataLine(carry);
          }
        };

        try {
          for (;;) {
            const { done, value } = await reader.read();
            if (done) {
              endBilling();

              break;
            }
            pushBilling(value);
          }
        } finally {
          reader.releaseLock();
        }
      };
      void runBilling();

      const stream = Readable.fromWeb(proxyStream as unknown as NodeReadableStream);

      reply.hijack();
      reply.raw.writeHead(response.status, getHeaders(response));
      stream.once(`error`, () => reply.raw.destroy());
      stream.pipe(reply.raw, { end: true });
    };

    const imageGenerations = async () =>
      proxyJson(await fetchJson(_.isObject(rawBody) ? (rawBody as Record<string, unknown>) : {}), `image`);

    const speechTranscriptions = async () => {
      const contentType = request.headers[`content-type`];

      await proxyJson(
        await fetchWithAuth(
          request.raw as unknown as BodyInit,
          _.isString(contentType) ? { "Content-Type": contentType } : undefined,
        ),
        `speechRecognition`,
      );
    };

    const routes = {
      "audio/transcriptions": speechTranscriptions,
      "chat/completions": chatCompletions,
      "images/generations": imageGenerations,
    };

    type Route = keyof typeof routes;

    if (tail in routes) {
      const run = routes[tail as Route];
      if (await balance.isLlmBlocked(userId)) {
        await reply.status(HttpStatus.ok).send({ status: `balanceBlocked` });

        return;
      }
      await run();

      return;
    }
    await reply.status(HttpStatus.notFound).send({ status: `notFound` });
  };
