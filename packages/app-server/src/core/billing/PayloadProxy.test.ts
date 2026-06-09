/* @vitest-environment node */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpStatus } from "@snappy/core";
import { HttpServer } from "@snappy/node";
import fastifyFactory, { type InjectOptions } from "fastify";
import { setImmediate } from "node:timers/promises";
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

describe(`PayloadProxy`, () => {
  it(`forwards requests to upstream`, async () => {
    await withFixture(async ({ inject, upstream }) => {
      upstream.on(upstream.json({ ok: true }));

      const response = await inject({ method: `GET` });

      expect(response.statusCode).toBe(HttpStatus.ok);
      expect(response.json()).toStrictEqual({ ok: true });
      expect(upstream.lastRequest()?.url).toBeDefined();
    });
  });

  describe(`json response`, () => {
    it(`emits parsed JSON once when body arrives in one piece`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        const body = { value: 12.5 };
        upstream.on(upstream.json(body));

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
        upstream.on(
          upstream.raw([text.slice(0, mid), text.slice(mid)], HttpStatus.ok, { "content-type": jsonContentType }),
        );

        const response = await inject({ method: `POST` });
        await waitPayloads(payloads);

        expect(payloads).toStrictEqual([body]);
        expect(response.json()).toStrictEqual(body);
      });
    });

    it(`emits parsed JSON when content-type includes charset`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        const body = { value: `ok` };
        upstream.on(upstream.json(body, HttpStatus.ok, { "content-type": jsonContentType }));

        const response = await inject({ method: `GET` });
        await waitPayloads(payloads);

        expect(payloads).toStrictEqual([body]);
        expect(response.json()).toStrictEqual(body);
      });
    });

    it(`does not emit when body is not JSON`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        upstream.on(upstream.raw(`not-json`, HttpStatus.ok, { "content-type": jsonContentType }));

        const response = await inject({ method: `GET` });
        await setImmediate();

        expect(payloads).toHaveLength(0);
        expect(response.body).toBe(`not-json`);
      });
    });

    it(`BUG: does not emit when gzip-compressed JSON cannot be parsed as text`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        upstream.on(upstream.gzipJson({ id: 43, rows: [{ blob: `x`.repeat(10_000) }] }));

        const response = await inject({ method: `POST` });
        await setImmediate();

        expect(payloads).toHaveLength(0);
        expect(response.statusCode).toBe(HttpStatus.ok);
      });
    });

    it(`returns upstreamError when upstream stream fails`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        upstream.on(upstream.abort());

        const response = await inject({ method: `GET` });

        await expect.poll(() => response.statusCode).toBe(HttpStatus.badGateway);

        expect(response.json()).toStrictEqual({ status: `upstreamError` });
        expect(payloads).toHaveLength(0);
      });
    });

    it(`emits error JSON from upstream`, async () => {
      await withFixture(async ({ inject, payloads, upstream }) => {
        const body = { error: { code: `bad_request`, message: `failed` } };
        upstream.on(upstream.json(body, HttpStatus.badRequest));

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
          upstream.raw([Buffer.from(`data: ${line.slice(0, 8)}`), Buffer.from(`${line.slice(8)}\n`)], HttpStatus.ok, {
            "content-type": `text/event-stream`,
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
