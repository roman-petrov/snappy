// cspell:word aitunnel
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { HttpStatus } from "@snappy/core";
import fastifyFactory, { type FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";
import { Readable, type Transform } from "node:stream";
import { finished } from "node:stream/promises";
import { setImmediate } from "node:timers/promises";
import { describe, expect, it, vi } from "vitest";

import type { ServerApp } from "./ServerApp";

import { AiTunnelProxy } from "./AiTunnelProxy";
import { SessionUserId } from "./SessionUserId";

type RegisterOptions = {
  preHandler?: (request: FastifyRequest, reply: FastifyReply, done: () => undefined) => Promise<unknown> | undefined;
  replyOptions?: {
    onResponse?: (request: FastifyRequest, reply: FastifyReply, upstream: unknown) => void;
    rewriteRequestHeaders?: (
      request: FastifyRequest,
      headers: Record<string, string | string[] | undefined>,
    ) => Record<string, string | string[] | undefined>;
  };
};

type ReplyHooksForTests = {
  onResponse: (
    request: FastifyRequest,
    reply: FastifyReply,
    upstreamResponse: { headers: Record<string, string | string[] | undefined>; stream?: null | Readable },
  ) => void;
  rewriteRequestHeaders: (
    request: FastifyRequest,
    headers: Record<string, string | string[] | undefined>,
  ) => Record<string, string | string[] | undefined>;
};

const { httpProxyMock } = vi.hoisted(() => {
  const register = vi.fn((app: FastifyInstance, options: RegisterOptions) => {
    app.all(`/*`, async (request, reply) => {
      const preHandlerDone = () => undefined;
      await options.preHandler?.(request, reply, preHandlerDone);
      if (reply.sent) {
        return;
      }
      void reply.send({ passthrough: true });
    });
  });

  return { httpProxyMock: register };
});

vi.mock(`@fastify/http-proxy`, () => ({ default: httpProxyMock }));

vi.mock(`./SessionUserId`, () => ({ SessionUserId: vi.fn() }));

vi.mock(`@snappy/config`, () => ({ Config: { aiTunnelKey: `test-ai-tunnel-key` } }));

const lastReplyHooks = (): ReplyHooksForTests => {
  const registered = httpProxyMock.mock.calls.at(-1)?.[1];
  const hooks = registered?.replyOptions;

  return hooks as unknown as ReplyHooksForTests;
};

type ReplyProbe = {
  readonly payloads: unknown[];
  readonly raw: Record<string, never>;
  readonly send: (payload?: unknown) => ReplyProbe;
  readonly sent: boolean;
  readonly status: (code: number) => ReplyProbe;
  readonly statusCode: number;
};

const replyProbe = (): ReplyProbe => {
  const payloads: unknown[] = [];
  let sent = false;
  let statusCode = 200;

  const reply: ReplyProbe = {
    payloads,
    raw: {},
    send(payload?: unknown) {
      sent = true;
      if (payload !== undefined) {
        payloads.push(payload);
      }

      return reply;
    },
    get sent() {
      return sent;
    },
    status(code: number) {
      statusCode = code;

      return reply;
    },
    get statusCode() {
      return statusCode;
    },
  };

  return reply;
};

const drainTransform = async (stream: Transform) => {
  stream.resume();
  await finished(stream);
};

const mockApi = () =>
  ({ balance: { debitForLlm: vi.fn(), isLlmBlocked: vi.fn() }, betterAuth: {} }) as unknown as ServerApp;

const resetMocks = () => {
  httpProxyMock.mockClear();
  vi.mocked(SessionUserId).mockReset();
};

const proxyWithReplyHooks = async () => {
  resetMocks();
  const app = fastifyFactory();
  const api = mockApi();
  await AiTunnelProxy(app, api);

  return { api, ...lastReplyHooks() };
};

describe(`AiTunnelProxy`, () => {
  describe(`preHandler`, () => {
    it(`returns 401 when there is no session user`, async () => {
      resetMocks();
      vi.mocked(SessionUserId).mockResolvedValue(undefined);
      const app = fastifyFactory();
      const api = mockApi();
      await AiTunnelProxy(app, api);
      const response = await app.inject({ method: `GET`, url: `/api/ai-tunnel/x` });

      expect(response.statusCode).toBe(HttpStatus.unauthorized);
      expect(response.json()).toStrictEqual({ status: `unauthorized` });
    });

    it(`returns balanceBlocked when LLM usage is blocked by balance`, async () => {
      resetMocks();
      vi.mocked(SessionUserId).mockResolvedValue(`user-1`);
      const app = fastifyFactory();
      const api = mockApi();
      vi.mocked(api.balance.isLlmBlocked).mockResolvedValue(true);
      await AiTunnelProxy(app, api);
      const response = await app.inject({ method: `GET`, url: `/api/ai-tunnel/x` });

      expect(response.statusCode).toBe(HttpStatus.ok);
      expect(response.json()).toStrictEqual({ status: `balanceBlocked` });
      expect(api.balance.isLlmBlocked).toHaveBeenCalledWith(`user-1`);
    });

    it(`continues the request when user is present and not blocked`, async () => {
      resetMocks();
      vi.mocked(SessionUserId).mockResolvedValue(`user-1`);
      const app = fastifyFactory();
      const api = mockApi();
      vi.mocked(api.balance.isLlmBlocked).mockResolvedValue(false);
      await AiTunnelProxy(app, api);
      const response = await app.inject({ method: `GET`, url: `/api/ai-tunnel/x` });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toStrictEqual({ passthrough: true });
    });
  });

  describe(`rewriteRequestHeaders`, () => {
    it(`forwards authorization with tunnel key, sets upstream host, drops cookie and host`, async () => {
      const { rewriteRequestHeaders } = await proxyWithReplyHooks();

      const result = rewriteRequestHeaders({} as FastifyRequest, {
        "authorization": `Bearer user-token`,
        "cookie": `a=b`,
        "host": `localhost:3000`,
        "x-custom": `1`,
      });

      expect(result).toStrictEqual({
        "authorization": `Bearer test-ai-tunnel-key`,
        "host": `api.aitunnel.ru`,
        "x-custom": `1`,
      });
      expect(result[`cookie`]).toBeUndefined();
    });
  });

  describe(`onResponse without body stream`, () => {
    it(`sends empty reply when body stream is missing`, async () => {
      const { api, onResponse } = await proxyWithReplyHooks();
      const reply = replyProbe();

      onResponse({ url: `/x`, userId: `u` } as FastifyRequest & { userId: string }, reply as unknown as FastifyReply, {
        headers: { "content-type": `application/json` },
      });

      expect(reply.sent).toBe(true);
      expect(reply.payloads).toStrictEqual([]);
      expect(api.balance.debitForLlm).not.toHaveBeenCalled();
    });
  });

  describe(`onResponse billing (JSON body)`, () => {
    it(`debits once with cost_rub, call URL and optional model`, async () => {
      const { api, onResponse } = await proxyWithReplyHooks();
      const stream = Readable.from([Buffer.from(JSON.stringify({ model: `gpt-x`, usage: { cost_rub: 12.5 } }))]);
      const reply = replyProbe();

      onResponse(
        { url: `/api/ai-tunnel/chat`, userId: `user-9` } as FastifyRequest & { userId: string },
        reply as unknown as FastifyReply,
        { headers: { "content-type": `application/json` }, stream },
      );

      await expect.poll(() => vi.mocked(api.balance.debitForLlm).mock.calls.length).toBeGreaterThan(0);

      expect(api.balance.debitForLlm).toHaveBeenCalledTimes(1);
      expect(api.balance.debitForLlm).toHaveBeenCalledWith(`user-9`, 12.5, {
        call: `/api/ai-tunnel/chat`,
        model: `gpt-x`,
      });
      expect(reply.payloads[0]).toStrictEqual({ model: `gpt-x`, usage: { cost_rub: 12.5 } });
    });

    it(`uses empty model when absent`, async () => {
      const { api, onResponse } = await proxyWithReplyHooks();
      const body = { usage: { cost_rub: 3 } };
      const stream = Readable.from([Buffer.from(JSON.stringify(body))]);
      const reply = replyProbe();

      onResponse(
        { url: `/api/z`, userId: `u` } as FastifyRequest & { userId: string },
        reply as unknown as FastifyReply,
        { headers: { "content-type": `application/json` }, stream },
      );

      await expect.poll(() => vi.mocked(api.balance.debitForLlm).mock.calls.length).toBeGreaterThan(0);

      expect(api.balance.debitForLlm).toHaveBeenCalledWith(`u`, 3, { call: `/api/z`, model: `` });
    });

    it(`does not debit when JSON lacks billing shape but still sends parsed body`, async () => {
      const { api, onResponse } = await proxyWithReplyHooks();
      const parsed = { choices: [] };
      const stream = Readable.from([Buffer.from(JSON.stringify(parsed))]);
      const reply = replyProbe();

      onResponse({ url: `/x`, userId: `u` } as FastifyRequest & { userId: string }, reply as unknown as FastifyReply, {
        headers: { "content-type": `application/json` },
        stream,
      });

      await expect.poll(() => reply.payloads.length).toBeGreaterThan(0);

      expect(api.balance.debitForLlm).not.toHaveBeenCalled();
      expect(reply.payloads[0]).toStrictEqual(parsed);
    });

    it(`sends raw buffer when body is not valid JSON`, async () => {
      const { api, onResponse } = await proxyWithReplyHooks();
      const raw = Buffer.from(`not-json`);
      const stream = Readable.from([raw]);
      const reply = replyProbe();

      onResponse({ url: `/x`, userId: `u` } as FastifyRequest & { userId: string }, reply as unknown as FastifyReply, {
        headers: { "content-type": `application/json` },
        stream,
      });

      await expect.poll(() => reply.payloads.length).toBeGreaterThan(0);

      expect(api.balance.debitForLlm).not.toHaveBeenCalled();
      expect(reply.payloads[0]).toStrictEqual(raw);
    });

    it(`responds with upstreamError on stream error`, async () => {
      const { api, onResponse } = await proxyWithReplyHooks();

      const stream = new Readable({
        read: () => {
          stream.destroy(new Error(`upstream`));
        },
      });

      const reply = replyProbe();

      onResponse({ url: `/x`, userId: `u` } as FastifyRequest & { userId: string }, reply as unknown as FastifyReply, {
        headers: { "content-type": `application/json` },
        stream,
      });

      await expect
        .poll(() => ({ code: reply.statusCode, payloads: reply.payloads.length }))
        .toMatchObject({ code: HttpStatus.badGateway, payloads: 1 });

      expect(reply.statusCode).toBe(HttpStatus.badGateway);
      expect(reply.payloads[0]).toStrictEqual({ status: `upstreamError` });
      expect(api.balance.debitForLlm).not.toHaveBeenCalled();
    });
  });

  describe(`onResponse billing (SSE)`, () => {
    it(`debits on first data line with usage payload`, async () => {
      const { api, onResponse } = await proxyWithReplyHooks();
      const line = `data: ${JSON.stringify({ usage: { cost_rub: 7 } })}\n`;
      const stream = Readable.from([Buffer.from(line)]);
      const reply = replyProbe();

      onResponse(
        { url: `/api/sse`, userId: `u1` } as FastifyRequest & { userId: string },
        reply as unknown as FastifyReply,
        { headers: { "content-type": `text/event-stream; charset=utf-8` }, stream },
      );

      await drainTransform(reply.payloads[0] as Transform);

      await expect.poll(() => vi.mocked(api.balance.debitForLlm).mock.calls.length).toBeGreaterThan(0);

      expect(api.balance.debitForLlm).toHaveBeenCalledTimes(1);
      expect(api.balance.debitForLlm).toHaveBeenCalledWith(`u1`, 7, { call: `/api/sse`, model: `` });
    });

    it(`debits on first billable line after a non-billable data JSON line`, async () => {
      const { api, onResponse } = await proxyWithReplyHooks();
      const skip = `data: ${JSON.stringify({ choices: [] })}\n`;
      const bill = `data: ${JSON.stringify({ usage: { cost_rub: 1 } })}\n`;
      const stream = Readable.from([Buffer.from(skip + bill)]);
      const reply = replyProbe();

      onResponse({ url: `/t`, userId: `u2` } as FastifyRequest & { userId: string }, reply as unknown as FastifyReply, {
        headers: { "content-type": `text/event-stream` },
        stream,
      });

      await drainTransform(reply.payloads[0] as Transform);

      await expect.poll(() => vi.mocked(api.balance.debitForLlm).mock.calls.length).toBeGreaterThan(0);

      expect(api.balance.debitForLlm).toHaveBeenCalledTimes(1);
      expect(api.balance.debitForLlm).toHaveBeenCalledWith(`u2`, 1, { call: `/t`, model: `` });
    });

    it(`ignores [DONE] and empty data payloads`, async () => {
      const { api, onResponse } = await proxyWithReplyHooks();
      const stream = Readable.from([Buffer.from(`data: [DONE]\n\ndata: \n`)]);
      const reply = replyProbe();

      onResponse({ url: `/t`, userId: `u` } as FastifyRequest & { userId: string }, reply as unknown as FastifyReply, {
        headers: { "content-type": `text/event-stream` },
        stream,
      });

      await drainTransform(reply.payloads[0] as Transform);

      await expect
        .poll(async () => {
          await setImmediate();

          return vi.mocked(api.balance.debitForLlm).mock.calls.length;
        })
        .toBe(0);
    });

    it(`handles usage line split across chunks`, async () => {
      const { api, onResponse } = await proxyWithReplyHooks();
      const json = JSON.stringify({ model: `m`, usage: { cost_rub: 4 } });
      const stream = Readable.from([Buffer.from(`data: ${json.slice(0, 8)}`), Buffer.from(`${json.slice(8)}\n`)]);
      const reply = replyProbe();

      onResponse(
        { url: `/chunk`, userId: `u3` } as FastifyRequest & { userId: string },
        reply as unknown as FastifyReply,
        { headers: { "content-type": `text/event-stream` }, stream },
      );

      await drainTransform(reply.payloads[0] as Transform);

      await expect.poll(() => vi.mocked(api.balance.debitForLlm).mock.calls.length).toBeGreaterThan(0);

      expect(api.balance.debitForLlm).toHaveBeenCalledWith(`u3`, 4, { call: `/chunk`, model: `m` });
    });

    it(`does not debit on non-JSON data line content`, async () => {
      const { api, onResponse } = await proxyWithReplyHooks();
      const stream = Readable.from([Buffer.from(`data: hello\n`)]);
      const reply = replyProbe();

      onResponse({ url: `/t`, userId: `u` } as FastifyRequest & { userId: string }, reply as unknown as FastifyReply, {
        headers: { "content-type": `text/event-stream` },
        stream,
      });

      await drainTransform(reply.payloads[0] as Transform);

      await expect
        .poll(async () => {
          await setImmediate();

          return vi.mocked(api.balance.debitForLlm).mock.calls.length;
        })
        .toBe(0);
    });

    it(`skips lines without data: prefix`, async () => {
      const { api, onResponse } = await proxyWithReplyHooks();
      const stream = Readable.from([Buffer.from(`: comment\n\ndata: ${JSON.stringify({ usage: { cost_rub: 2 } })}\n`)]);
      const reply = replyProbe();

      onResponse({ url: `/t`, userId: `u` } as FastifyRequest & { userId: string }, reply as unknown as FastifyReply, {
        headers: { "content-type": `text/event-stream` },
        stream,
      });

      await drainTransform(reply.payloads[0] as Transform);

      await expect.poll(() => vi.mocked(api.balance.debitForLlm).mock.calls.length).toBeGreaterThan(0);

      expect(api.balance.debitForLlm).toHaveBeenCalledWith(`u`, 2, { call: `/t`, model: `` });
    });
  });
});
