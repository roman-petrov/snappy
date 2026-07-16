/* @vitest-environment node */
import { HttpConstants, HttpStatus, Json, MimeType } from "@snappy/core";
import { HttpServer } from "@snappy/node";
import net from "node:net";
import { describe, expect, it } from "vitest";

import { TunnelHttp } from "./TunnelHttp";

const { fetch } = TunnelHttp;

const connectTo = async (port: number) =>
  new Promise<net.Socket>((resolve, reject) => {
    const socket = net.connect({ host: HttpConstants.loopback, port }, () => {
      socket.off(`error`, reject);
      resolve(socket);
    });
    socket.once(`error`, reject);
  });

describe(`fetch`, () => {
  it(`posts json and returns the upstream response`, async () => {
    const upstream = HttpServer();
    const { port } = await upstream.start();
    upstream.on(upstream.respond({ body: { ok: true }, status: HttpStatus.ok }));

    const response = await fetch(async () => connectTo(port), `/hook`, { json: { a: 1 } });

    expect(response.status).toBe(HttpStatus.ok);
    expect(Json.parse(await response.text())).toStrictEqual({ ok: true });
    expect(upstream.lastRequest()?.method).toBe(`POST`);
    expect(upstream.lastRequest()?.headers[`content-type`]).toBe(MimeType.json);
    expect(upstream.lastRequest()?.url).toBe(`/hook`);

    await upstream.stop();
  });

  it(`posts without a body when json is omitted`, async () => {
    const upstream = HttpServer();
    const { port } = await upstream.start();
    upstream.on(upstream.respond({ body: Buffer.from(`empty`), status: HttpStatus.ok }));

    const response = await fetch(async () => connectTo(port), `/plain`);

    expect(response.status).toBe(HttpStatus.ok);
    await expect(response.text()).resolves.toBe(`empty`);
    expect(upstream.lastRequest()?.headers[`content-type`]).toBeUndefined();

    await upstream.stop();
  });

  it(`rejects when connect fails`, async () => {
    await expect(fetch(async () => connectTo(1), `/`)).rejects.toThrow(Error);
  });
});
