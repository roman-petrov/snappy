/* @vitest-environment node */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus } from "@snappy/core";
import { describe, expect, it } from "vitest";

import { HttpServer, type HttpServer as HttpServerType } from "./HttpServer";

type ServerContext = { server: HttpServerType; url: string };

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
      server.on(server.json({ ok: true }));

      await fetch(`${url}/resource`, { headers: { authorization: `Bearer token`, host: `ignored` }, method: `POST` });

      expect(server.lastRequest()).toStrictEqual({
        headers: expect.objectContaining({ authorization: `Bearer token` }),
        method: `POST`,
        url: `/resource`,
      });
    });
  });

  it(`json responds with JSON body`, async () => {
    await withServer(async ({ server, url }) => {
      const body = { value: 1 };
      server.on(server.json(body));

      const response = await fetch(`${url}/`);

      expect(response.status).toBe(HttpStatus.ok);
      expect(response.headers.get(`content-type`)).toContain(`application/json`);
      await expect(response.json()).resolves.toStrictEqual(body);
    });
  });

  it(`json accepts custom status and headers`, async () => {
    await withServer(async ({ server, url }) => {
      const body = { error: { code: `bad_request` } };
      server.on(server.json(body, HttpStatus.badRequest, { "x-test": `1` }));

      const response = await fetch(`${url}/`);

      expect(response.status).toBe(HttpStatus.badRequest);
      expect(response.headers.get(`x-test`)).toBe(`1`);
      await expect(response.json()).resolves.toStrictEqual(body);
    });
  });

  it(`raw responds with body and headers`, async () => {
    await withServer(async ({ server, url }) => {
      server.on(server.raw(`plain`, HttpStatus.ok, { "content-type": `text/plain` }));

      const response = await fetch(`${url}/`);

      await expect(response.text()).resolves.toBe(`plain`);
      expect(response.headers.get(`content-type`)).toBe(`text/plain`);
    });
  });

  it(`raw writes multiple chunks`, async () => {
    await withServer(async ({ server, url }) => {
      server.on(server.raw([`hel`, `lo`]));

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

  it(`gzipJson responds with gzip-encoded JSON`, async () => {
    await withServer(async ({ server, url }) => {
      const body = { rows: [{ blob: `x`.repeat(100) }] };
      server.on(server.gzipJson(body));

      const response = await fetch(`${url}/`);

      expect(response.headers.get(`content-encoding`)).toBe(`gzip`);
      await expect(response.json()).resolves.toStrictEqual(body);
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
