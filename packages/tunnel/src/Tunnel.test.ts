/* @vitest-environment node */
import { HttpConstants, HttpStatus } from "@snappy/core";
import fastifyFactory from "fastify";
import { describe, expect, it } from "vitest";

import { Tunnel } from "./Tunnel";

describe(`Tunnel`, () => {
  it(`registers the local route when hub is off`, async () => {
    const app = fastifyFactory();

    const client = await Tunnel({
      app,
      entryPath: `/api/webhooks/hook/test`,
      handle: async (_request, reply) => reply.send({ ok: true }),
      host: HttpConstants.loopback,
      key: `k`,
      localPath: `/api/webhooks/hook`,
      wsPath: `/api/tunnel`,
    });
    await app.ready();

    const response = await app.inject({ method: `POST`, url: `/api/webhooks/hook` });

    expect(response.statusCode).toBe(HttpStatus.ok);
    expect(response.json()).toStrictEqual({ ok: true });

    client?.stop();
    await app.close();
  });

  it(`registers the entry route that proxies when hub is on`, async () => {
    const app = fastifyFactory();
    await Tunnel({
      app,
      entryPath: `/api/webhooks/hook/test`,
      handle: async (_request, reply) => reply.send({ local: true }),
      host: HttpConstants.loopback,
      hub: true,
      key: `k`,
      localPath: `/api/webhooks/hook`,
      wsPath: `/api/tunnel`,
    });
    await app.ready();

    const local = await app.inject({ method: `POST`, url: `/api/webhooks/hook` });
    const entry = await app.inject({ method: `POST`, payload: { a: 1 }, url: `/api/webhooks/hook/test` });

    expect(local.statusCode).toBe(HttpStatus.ok);
    expect(local.json()).toStrictEqual({ local: true });
    expect(entry.statusCode).toBe(HttpStatus.badGateway);

    await app.close();
  });

  it(`rejects unauthorized requests when authorize fails`, async () => {
    const app = fastifyFactory();
    await Tunnel({
      app,
      authorize: () => false,
      entryPath: `/api/webhooks/hook/test`,
      handle: async (_request, reply) => reply.send({ ok: true }),
      host: HttpConstants.loopback,
      hub: true,
      key: `k`,
      localPath: `/api/webhooks/hook`,
      wsPath: `/api/tunnel`,
    });
    await app.ready();

    const local = await app.inject({ method: `POST`, url: `/api/webhooks/hook` });
    const entry = await app.inject({ method: `POST`, url: `/api/webhooks/hook/test` });

    expect(local.statusCode).toBe(HttpStatus.forbidden);
    expect(entry.statusCode).toBe(HttpStatus.forbidden);

    await app.close();
  });
});
