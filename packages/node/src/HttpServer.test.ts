/* @vitest-environment node */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus } from "@snappy/core";
import { zstdDecompressSync } from "node:zlib";
import { describe, expect, it } from "vitest";

import { HttpServer, type HttpServer as HttpServerType } from "./HttpServer";

type ServerContext = { server: HttpServerType; url: string };

const jsonContentType = `application/json; charset=utf-8`;

const withServer = async (run: (context: ServerContext) => Promise<void> | void) => {
  const server = HttpServer();
  const { url } = await server.start();
  try {
    await run({ server, url });
  } finally {
    await server.stop();
  }
};

describe(`HttpServer`, () => {
  it(`returns not found when handler is not set`, async () => {
    await withServer(async ({ url }) => {
      const response = await fetch(`${url}/missing`);

      expect(response.status).toBe(HttpStatus.notFound);
      await expect(response.text()).resolves.toBe(`not found`);
    });
  });

  it(`records method, path, and headers`, async () => {
    await withServer(async ({ server, url }) => {
      server.on(server.respond({ body: { ok: true } }));

      await fetch(`${url}/resource`, { headers: { authorization: `Bearer token`, host: `ignored` }, method: `POST` });

      expect(server.lastRequest()).toStrictEqual({
        headers: expect.objectContaining({ authorization: `Bearer token` }),
        method: `POST`,
        url: `/resource`,
      });
    });
  });

  it(`respond sends JSON body`, async () => {
    await withServer(async ({ server, url }) => {
      const body = { value: 1 };
      server.on(server.respond({ body }));

      const response = await fetch(`${url}/`);

      expect(response.status).toBe(HttpStatus.ok);
      expect(response.headers.get(`content-type`)).toContain(`application/json`);
      await expect(response.json()).resolves.toStrictEqual(body);
    });
  });

  it(`respond accepts custom status and headers`, async () => {
    await withServer(async ({ server, url }) => {
      const body = { error: { code: `bad_request` } };
      server.on(server.respond({ body, headers: { "x-test": `1` }, status: HttpStatus.badRequest }));

      const response = await fetch(`${url}/`);

      expect(response.status).toBe(HttpStatus.badRequest);
      expect(response.headers.get(`x-test`)).toBe(`1`);
      await expect(response.json()).resolves.toStrictEqual(body);
    });
  });

  it(`respond sends raw body and content type`, async () => {
    await withServer(async ({ server, url }) => {
      server.on(server.respond({ body: `plain`, contentType: `text/plain` }));

      const response = await fetch(`${url}/`);

      await expect(response.text()).resolves.toBe(`plain`);
      expect(response.headers.get(`content-type`)).toBe(`text/plain`);
    });
  });

  it(`respond writes multiple chunks`, async () => {
    await withServer(async ({ server, url }) => {
      server.on(server.respond({ body: [`hel`, `lo`] }));

      const response = await fetch(`${url}/`);

      await expect(response.text()).resolves.toBe(`hello`);
    });
  });

  it(`sse responds with event-stream body`, async () => {
    await withServer(async ({ server, url }) => {
      const event = { n: 2 };
      server.on(server.sse([`data: ${JSON.stringify(event)}`]));

      const response = await fetch(`${url}/`);

      expect(response.headers.get(`content-type`)).toContain(`text/event-stream`);
      await expect(response.text()).resolves.toBe(`data: ${JSON.stringify(event)}`);
    });
  });

  it(`respond sends gzip-encoded JSON`, async () => {
    await withServer(async ({ server, url }) => {
      const body = { rows: [{ blob: `x`.repeat(100) }] };
      server.on(server.respond({ body, contentType: jsonContentType, encoding: `gzip` }));

      const response = await fetch(`${url}/`);

      expect(response.headers.get(`content-encoding`)).toBe(`gzip`);
      await expect(response.json()).resolves.toStrictEqual(body);
    });
  });

  it(`respond sends zstd-encoded JSON`, async () => {
    await withServer(async ({ server, url }) => {
      const body = { rows: [{ blob: `x`.repeat(100) }] };
      server.on(server.respond({ body, contentType: jsonContentType, encoding: `zstd` }));

      const response = await fetch(`${url}/`);

      expect(response.headers.get(`content-encoding`)).toBe(`zstd`);
      const raw = Buffer.from(await response.arrayBuffer());
      const text = (raw[0] === 0x7b ? raw : zstdDecompressSync(raw)).toString();
      expect(JSON.parse(text)).toStrictEqual(body);
    });
  });

  it(`abort closes the connection before the body is complete`, async () => {
    await withServer(async ({ server, url }) => {
      server.on(server.abort());

      const response = await fetch(`${url}/`);

      expect(response.status).toBe(HttpStatus.ok);
      await expect(response.text()).rejects.toThrow(`terminated`);
    });
  });
});
