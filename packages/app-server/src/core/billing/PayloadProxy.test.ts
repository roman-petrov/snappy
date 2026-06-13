/* @vitest-environment node */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpStatus } from "@snappy/core";
import { HttpServer } from "@snappy/node";
import fastifyFactory, { type InjectOptions } from "fastify";
import { setImmediate } from "node:timers/promises";
import { gunzipSync, zstdDecompressSync } from "node:zlib";
import { describe, expect, it } from "vitest";

import { PayloadProxy } from "./PayloadProxy";

const proxyPath = `/proxy/resource`;
const jsonContentType = `application/json; charset=utf-8`;

type Fixture = {
  inject: (options?: InjectOptions) => ReturnType<ReturnType<typeof fastifyFactory>[`inject`]>;
  payloads: unknown[];
  upstream: ReturnType<typeof HttpServer>;
};

const waitPayloads = async (payloads: unknown[], count = 1) => {
  await expect.poll(() => payloads.length).toBeGreaterThanOrEqual(count);
};

const withFixture = async (run: (fixture: Fixture) => Promise<void> | void) => {
  const upstream = HttpServer();
  const { url } = await upstream.start();
  const payloads: unknown[] = [];
  const app = fastifyFactory();
  await PayloadProxy(app, {
    onPayload: payload => {
      payloads.push(payload);
    },
    prefix: `/proxy`,
    upstream: url,
  });
  await app.ready();

  try {
    await run({ inject: async options => app.inject({ url: proxyPath, ...options }), payloads, upstream });
  } finally {
    await app.close();
    await upstream.stop();
  }
};

const upstreamError = { status: `upstreamError` };

describe(`PayloadProxy`, () => {
  it(`forwards requests to upstream`, async () => {
    await withFixture(async ({ inject, upstream }) => {
      upstream.on(upstream.respond({ body: { ok: true } }));

      const response = await inject({ method: `GET` });

      expect(response.statusCode).toBe(HttpStatus.ok);
      expect(response.json()).toStrictEqual({ ok: true });
      expect(upstream.lastRequest()?.url).toBeDefined();
    });
  });

  it(`forwards multipart form-data requests`, async () => {
    await withFixture(async ({ inject, upstream }) => {
      const boundary = `----snappy-test`;

      const body = [
        `--${boundary}`,
        `Content-Disposition: form-data; name="field"`,
        ``,
        `value`,
        `--${boundary}--`,
        ``,
      ].join(`\r\n`);

      const upstreamBody = { ok: true };
      upstream.on(upstream.respond({ body: upstreamBody }));

      const response = await inject({
        headers: { "content-type": `multipart/form-data; boundary=${boundary}` },
        method: `POST`,
        payload: body,
      });

      expect(response.statusCode).toBe(HttpStatus.ok);
      expect(response.json()).toStrictEqual(upstreamBody);
      expect(upstream.lastRequest()?.headers[`content-type`]).toContain(`multipart/form-data`);
    });
  });

  describe(`json response`, () => {
    it(`emits parsed JSON once when body arrives in one piece`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        const body = { value: 12.5 };
        upstream.on(upstream.respond({ body }));

        const response = await inject({ method: `POST` });
        await waitPayloads(payloads);

        expect(payloads).toStrictEqual([body]);
        expect(response.json()).toStrictEqual(body);
      });
    });

    it(`emits parsed JSON when body is delivered in chunks`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        const body = { value: `chunked` };
        const text = JSON.stringify(body);
        const mid = Math.floor(text.length / 2);
        upstream.on(upstream.respond({ body: [text.slice(0, mid), text.slice(mid)], contentType: jsonContentType }));

        const response = await inject({ method: `POST` });
        await waitPayloads(payloads);

        expect(payloads).toStrictEqual([body]);
        expect(response.json()).toStrictEqual(body);
      });
    });

    it(`emits parsed JSON when content-type includes charset`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        const body = { value: `ok` };
        upstream.on(upstream.respond({ body, contentType: jsonContentType }));

        const response = await inject({ method: `GET` });
        await waitPayloads(payloads);

        expect(payloads).toStrictEqual([body]);
        expect(response.json()).toStrictEqual(body);
      });
    });

    it(`returns upstreamError when body is not JSON`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        upstream.on(upstream.respond({ body: `not-json`, contentType: jsonContentType }));

        const response = await inject({ method: `GET` });

        expect(payloads).toHaveLength(0);
        expect(response.statusCode).toBe(HttpStatus.badGateway);
        expect(response.json()).toStrictEqual(upstreamError);
      });
    });

    it(`emits parsed JSON when body is gzip-compressed`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        const body = { id: 43, rows: [{ blob: `x`.repeat(10_000) }] };
        upstream.on(upstream.respond({ body, contentType: jsonContentType, encoding: `gzip` }));

        const response = await inject({ method: `POST` });
        await waitPayloads(payloads);

        expect(payloads).toStrictEqual([body]);
        expect(response.statusCode).toBe(HttpStatus.ok);
        expect(response.headers[`content-encoding`]).toBe(`gzip`);
        expect(JSON.parse(gunzipSync(response.rawPayload).toString(`utf8`))).toStrictEqual(body);
      });
    });

    it(`emits parsed JSON when body is zstd-compressed`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        const body = { id: 44, rows: [{ blob: `x`.repeat(10_000) }], usage: { cost_rub: 1.5 } };
        upstream.on(upstream.respond({ body, contentType: jsonContentType, encoding: `zstd` }));

        const response = await inject({ method: `POST` });
        await waitPayloads(payloads);

        expect(payloads).toStrictEqual([body]);
        expect(response.statusCode).toBe(HttpStatus.ok);
        expect(response.headers[`content-encoding`]).toBe(`zstd`);
        expect(JSON.parse(zstdDecompressSync(response.rawPayload).toString(`utf8`))).toStrictEqual(body);
      });
    });

    it(`returns upstreamError when gzip body is corrupt`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        upstream.on(
          upstream.respond({
            body: Buffer.from(`corrupt`),
            contentType: jsonContentType,
            headers: { "content-encoding": `gzip` },
          }),
        );

        const response = await inject({ method: `POST` });

        expect(payloads).toHaveLength(0);
        expect(response.statusCode).toBe(HttpStatus.badGateway);
        expect(response.json()).toStrictEqual(upstreamError);
      });
    });

    it(`returns upstreamError when zstd body is corrupt`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        upstream.on(
          upstream.respond({
            body: Buffer.from([0x28, 0xb5, 0x2f, 0xfd, 0x00]),
            contentType: jsonContentType,
            headers: { "content-encoding": `zstd` },
          }),
        );

        const response = await inject({ method: `POST` });

        expect(payloads).toHaveLength(0);
        expect(response.statusCode).toBe(HttpStatus.badGateway);
        expect(response.json()).toStrictEqual(upstreamError);
      });
    });

    it(`returns upstreamError when gzip body is not JSON`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        upstream.on(upstream.respond({ body: `not-json`, contentType: jsonContentType, encoding: `gzip` }));

        const response = await inject({ method: `POST` });

        expect(payloads).toHaveLength(0);
        expect(response.statusCode).toBe(HttpStatus.badGateway);
        expect(response.json()).toStrictEqual(upstreamError);
      });
    });

    it(`returns upstreamError when upstream stream fails`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        upstream.on(upstream.abort());

        const response = await inject({ method: `GET` });

        await expect.poll(() => response.statusCode).toBe(HttpStatus.badGateway);

        expect(response.json()).toStrictEqual(upstreamError);
        expect(payloads).toHaveLength(0);
      });
    });

    it(`emits error JSON from upstream`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        const body = { error: { code: `bad_request`, message: `failed` } };
        upstream.on(upstream.respond({ body, status: HttpStatus.badRequest }));

        const response = await inject({ method: `POST` });
        await waitPayloads(payloads);

        expect(payloads).toStrictEqual([body]);
        expect(response.statusCode).toBe(HttpStatus.badRequest);
      });
    });
  });

  describe(`event-stream response`, () => {
    it(`emits on data lines with JSON`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        const event = { n: 7 };
        upstream.on(upstream.sse([`data: ${JSON.stringify(event)}\n`]));

        await inject({ method: `POST` });
        await waitPayloads(payloads);

        expect(payloads).toStrictEqual([event]);
      });
    });

    it(`emits on every data line with JSON`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        const first = { n: 1 };
        const second = { n: 9 };
        upstream.on(upstream.sse([`data: ${JSON.stringify(first)}\n`, `data: ${JSON.stringify(second)}\n`]));

        await inject({ method: `POST` });
        await waitPayloads(payloads, 2);

        expect(payloads).toStrictEqual([first, second]);
      });
    });

    it(`emits on every data line in order`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        const first = { value: `pending` };
        const second = { n: 1 };
        upstream.on(upstream.sse([`data: ${JSON.stringify(first)}\n`, `data: ${JSON.stringify(second)}\n`]));

        await inject({ method: `POST` });
        await waitPayloads(payloads, 2);

        expect(payloads).toStrictEqual([first, second]);
      });
    });

    it(`ignores terminal and empty data lines`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        upstream.on(upstream.sse([`data: [DONE]`, `data: `]));

        await inject({ method: `GET` });
        await setImmediate();

        expect(payloads).toHaveLength(0);
      });
    });

    it(`emits when a data line is split across chunks`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        const event = { n: 4, name: `b` };
        const line = JSON.stringify(event);
        upstream.on(
          upstream.respond({
            body: [Buffer.from(`data: ${line.slice(0, 8)}`), Buffer.from(`${line.slice(8)}\n`)],
            contentType: `text/event-stream`,
          }),
        );

        await inject({ method: `POST` });
        await waitPayloads(payloads);

        expect(payloads).toStrictEqual([event]);
      });
    });

    it(`ignores non-JSON data lines`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        upstream.on(upstream.sse([`data: hello`]));

        await inject({ method: `GET` });
        await setImmediate();

        expect(payloads).toHaveLength(0);
      });
    });

    it(`ignores comment lines and emits on data lines`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        const event = { n: 2 };
        upstream.on(upstream.sse([`: comment`, ``, `data: ${JSON.stringify(event)}`]));

        await inject({ method: `POST` });
        await waitPayloads(payloads);

        expect(payloads).toStrictEqual([event]);
      });
    });
  });
});
