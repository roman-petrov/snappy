/* @vitest-environment node */
/* cspell:word aitunnel */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { Db, DbUser } from "@snappy/db";

import { HttpStatus, MimeType } from "@snappy/core";
import { HttpServer } from "@snappy/node";
import fastifyFactory, { type InjectOptions } from "fastify";
import { setImmediate } from "node:timers/promises";
import { gunzipSync, zstdDecompressSync } from "node:zlib";
import { describe, expect, it, vi } from "vitest";

import type { Balance } from "../Balance";
import type { BetterAuth } from "../BetterAuth";

import { Session } from "../Session";
import { Mock } from "../test/Mock";
import { AiTunnelProxy } from "./AiTunnelProxy";

vi.mock(`../Session`, () => ({ Session: { dbUser: vi.fn() } }));

vi.mock(`@snappy/config`, () => ({ Config: { aiTunnelKey: () => `test-ai-tunnel-key` } }));

vi.mock(`@snappy/log`, () => {
  const channel = () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn() });

  return { Log: { ai: channel(), auth: channel(), payment: channel() } };
});

const chatPath = `/api/ai-tunnel/v1/chat/completions`;
const editsPath = `/api/ai-tunnel/v1/images/edits`;
const imagesPath = `/api/ai-tunnel/v1/images/generations`;
const jsonContentType = MimeType.json;
const model = `gpt-image-1-mini`;
const tunnelKey = `test-ai-tunnel-key`;
const upstreamError = { status: `upstreamError` };

type Inject = (path: string, options?: InjectOptions) => ReturnType<ReturnType<typeof fastifyFactory>[`inject`]>;

type Tunnel = { balance: Balance; betterAuth: BetterAuth; db: ReturnType<typeof Db>; dbUser: DbUser };

type TunnelOptions = { authorized?: boolean; blocked?: boolean };

const tunnel = (userId = `user-1`): Tunnel => ({
  balance: {
    creditFromTopUp: vi.fn(),
    debitForLlm: vi.fn().mockResolvedValue(undefined),
    isLlmBlocked: vi.fn().mockResolvedValue(false),
    read: vi.fn(),
    rpc: {},
  } as unknown as Balance,
  betterAuth: {} as BetterAuth,
  db: Mock.createDb(),
  dbUser: Mock.createDbUser(userId),
});

const imageBody = (costRub: number) => ({ data: [{ b64_json: `aGVsbG8=` }], model, usage: { cost_rub: costRub } });
const sseChunk = (payload: Record<string, unknown>) => `data: ${JSON.stringify(payload)}\n`;

const withTunnel = async (
  { authorized = true, blocked = false }: TunnelOptions,
  run: (fixture: { api: Tunnel; inject: Inject; upstream: ReturnType<typeof HttpServer> }) => Promise<void> | void,
) => {
  const upstream = HttpServer();
  const { url } = await upstream.start();
  const api = tunnel();
  vi.mocked(Session.dbUser).mockResolvedValue(authorized ? api.dbUser : undefined);
  vi.mocked(api.balance.isLlmBlocked).mockResolvedValue(blocked);

  const app = fastifyFactory();
  await AiTunnelProxy(app, { balance: api.balance, betterAuth: api.betterAuth, db: api.db, upstream: url });
  await app.ready();

  try {
    await run({
      api,
      inject: async (path, options) => app.inject({ method: `POST`, url: path, ...options }),
      upstream,
    });
  } finally {
    await app.close();
    await upstream.stop();
  }
};

const noDebit = async (api: Tunnel) => {
  await setImmediate();

  expect(api.balance.debitForLlm).not.toHaveBeenCalled();
};

describe(`AiTunnelProxy`, () => {
  describe(`gate`, () => {
    it(`returns unauthorized without calling upstream`, async () => {
      await withTunnel({ authorized: false }, async ({ api, inject, upstream }) => {
        upstream.on(upstream.respond({ body: imageBody(1) }));

        const response = await inject(imagesPath);

        expect(response.statusCode).toBe(HttpStatus.unauthorized);
        expect(response.json()).toStrictEqual({ status: `unauthorized` });
        expect(upstream.lastRequest()).toBeUndefined();

        await noDebit(api);
      });
    });

    it(`returns balanceBlocked without calling upstream`, async () => {
      await withTunnel({ blocked: true }, async ({ api, inject, upstream }) => {
        upstream.on(upstream.respond({ body: imageBody(1) }));

        const response = await inject(imagesPath);

        expect(response.statusCode).toBe(HttpStatus.ok);
        expect(response.json()).toStrictEqual({ status: `balanceBlocked` });
        expect(upstream.lastRequest()).toBeUndefined();

        await noDebit(api);
      });
    });
  });

  describe(`json response`, () => {
    it(`debits usage and forwards plain JSON`, async () => {
      await withTunnel({}, async ({ api, inject, upstream }) => {
        const body = imageBody(1.2);
        upstream.on(upstream.respond({ body, contentType: jsonContentType }));

        const response = await inject(imagesPath);

        expect(response.statusCode).toBe(HttpStatus.ok);
        expect(response.headers[`content-encoding`]).toBeUndefined();
        expect(response.json()).toStrictEqual(body);

        await setImmediate();

        expect(api.balance.debitForLlm).toHaveBeenCalledExactlyOnceWith(api.dbUser, 1.2, { call: imagesPath, model });
      });
    });

    it(`debits usage and forwards multipart image edits`, async () => {
      await withTunnel({}, async ({ api, inject, upstream }) => {
        const body = imageBody(0.8);
        upstream.on(upstream.respond({ body, contentType: jsonContentType }));

        const boundary = `----snappy-test`;

        const payload = Buffer.from(
          `--${boundary}\r\nContent-Disposition: form-data; name="model"\r\n\r\n${model}\r\n--${boundary}\r\nContent-Disposition: form-data; name="prompt"\r\n\r\nremove background\r\n--${boundary}--\r\n`,
        );

        const response = await inject(editsPath, {
          headers: { "content-type": `multipart/form-data; boundary=${boundary}` },
          payload,
        });

        expect(response.statusCode).toBe(HttpStatus.ok);
        expect(response.json()).toStrictEqual(body);

        await setImmediate();

        expect(api.balance.debitForLlm).toHaveBeenCalledExactlyOnceWith(api.dbUser, 0.8, { call: editsPath, model });
      });
    });

    it(`debits usage and forwards gzip-compressed JSON unchanged`, async () => {
      await withTunnel({}, async ({ api, inject, upstream }) => {
        const body = imageBody(3);
        upstream.on(upstream.respond({ body, contentType: jsonContentType, encoding: `gzip` }));

        const response = await inject(imagesPath);

        expect(response.statusCode).toBe(HttpStatus.ok);
        expect(response.headers[`content-encoding`]).toBe(`gzip`);
        expect(JSON.parse(gunzipSync(response.rawPayload).toString(`utf8`))).toStrictEqual(body);

        await setImmediate();

        expect(api.balance.debitForLlm).toHaveBeenCalledExactlyOnceWith(api.dbUser, 3, { call: imagesPath, model });
      });
    });

    it(`debits usage and forwards zstd-compressed JSON unchanged`, async () => {
      await withTunnel({}, async ({ api, inject, upstream }) => {
        const body = imageBody(2.5);
        upstream.on(upstream.respond({ body, contentType: jsonContentType, encoding: `zstd` }));

        const response = await inject(imagesPath);

        expect(response.statusCode).toBe(HttpStatus.ok);
        expect(response.headers[`content-encoding`]).toBe(`zstd`);
        expect(JSON.parse(zstdDecompressSync(response.rawPayload).toString(`utf8`))).toStrictEqual(body);

        await setImmediate();

        expect(api.balance.debitForLlm).toHaveBeenCalledExactlyOnceWith(api.dbUser, 2.5, { call: imagesPath, model });
      });
    });

    it(`rewrites authorization and host for upstream`, async () => {
      await withTunnel({}, async ({ inject, upstream }) => {
        upstream.on(upstream.respond({ body: imageBody(0.1), contentType: jsonContentType }));

        await inject(imagesPath, {
          headers: { authorization: `Bearer client-token`, cookie: `a=b`, host: `localhost` },
        });

        expect(upstream.lastRequest()?.headers).toStrictEqual(
          expect.objectContaining({ authorization: `Bearer ${tunnelKey}`, host: `api.aitunnel.ru` }),
        );
        expect(upstream.lastRequest()?.headers.cookie).toBeUndefined();
      });
    });

    it(`returns upstreamError on corrupt zstd without debiting`, async () => {
      await withTunnel({}, async ({ api, inject, upstream }) => {
        upstream.on(
          upstream.respond({
            body: Buffer.from([0x28, 0xb5, 0x2f, 0xfd, 0x00]),
            contentType: jsonContentType,
            headers: { "content-encoding": `zstd` },
          }),
        );

        const response = await inject(imagesPath);

        expect(response.statusCode).toBe(HttpStatus.badGateway);
        expect(response.json()).toStrictEqual(upstreamError);

        await noDebit(api);
      });
    });

    it(`returns upstreamError when upstream stream fails without debiting`, async () => {
      await withTunnel({}, async ({ api, inject, upstream }) => {
        upstream.on(upstream.abort());

        const response = await inject(imagesPath);

        await expect.poll(() => response.statusCode).toBe(HttpStatus.badGateway);
        expect(response.json()).toStrictEqual(upstreamError);

        await noDebit(api);
      });
    });
  });

  describe(`event-stream response`, () => {
    it(`debits once from the final chunk with usage and forwards the stream`, async () => {
      await withTunnel({}, async ({ api, inject, upstream }) => {
        const delta = { choices: [{ delta: { content: `hi` } }] };
        const final = { choices: [{ delta: {} }], model: `deepseek/test`, usage: { cost_rub: 0.03 } };
        upstream.on(upstream.sse([sseChunk(delta), sseChunk(final)]));

        const response = await inject(chatPath);

        expect(response.statusCode).toBe(HttpStatus.ok);
        expect(response.headers[`content-type`]).toContain(MimeType.eventStream);
        expect(response.body).toContain(`"cost_rub":0.03`);

        await setImmediate();

        expect(api.balance.debitForLlm).toHaveBeenCalledExactlyOnceWith(api.dbUser, 0.03, {
          call: chatPath,
          model: `deepseek/test`,
        });
      });
    });

    it(`forwards stream without debiting when no chunk has usage`, async () => {
      await withTunnel({}, async ({ api, inject, upstream }) => {
        const delta = { choices: [{ delta: { content: `hi` } }] };
        upstream.on(upstream.sse([sseChunk(delta), `data: [DONE]`]));

        const response = await inject(chatPath);

        expect(response.statusCode).toBe(HttpStatus.ok);
        expect(response.body).toContain(`"content":"hi"`);

        await noDebit(api);
      });
    });
  });
});
