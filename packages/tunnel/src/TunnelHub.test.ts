/* @vitest-environment node */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { _, HttpConstants, HttpStatus, Json } from "@snappy/core";
import { HttpServer } from "@snappy/node";
import fastifyFactory from "fastify";
import net from "node:net";
import { describe, expect, it } from "vitest";
import ws from "ws";

import { TunnelHub } from "./TunnelHub";

const key = `test-tunnel-key`;
const wsPath = `/api/tunnel`;
const idSize = 4;

const frame = (id: number, chunk: Buffer) => {
  const header = Buffer.alloc(idSize);
  header.writeUInt32BE(id);

  return Buffer.concat([header, chunk]);
};

const bytes = (raw: ws.RawData) => (Buffer.isBuffer(raw) ? raw : Buffer.from(raw as ArrayBuffer));

const peer = async (url: string, localPort: number) => {
  const socket = new ws(url);
  await new Promise<void>((resolve, reject) => {
    socket.once(`open`, () => resolve());
    socket.once(`error`, reject);
  });
  socket.send(Json.stringify({ key, type: `auth` }));
  socket.send(Json.stringify({ port: localPort, type: `ready` }));

  const locals = new Map<number, net.Socket>();
  const opening = new Set<number>();
  const pending = new Map<number, Buffer[]>();

  const attach = (id: number, local: net.Socket) => {
    locals.set(id, local);
    opening.delete(id);
    for (const chunk of pending.get(id) ?? []) {
      local.write(chunk);
    }
    pending.delete(id);
    local.on(`data`, (chunk: Buffer) => {
      socket.send(frame(id, chunk));
    });
    local.on(`close`, () => {
      locals.delete(id);
      socket.send(Json.stringify({ id, type: `close` }));
    });
  };

  socket.on(`message`, (raw, isBinary) => {
    if (!isBinary) {
      const message: unknown = Json.parse(bytes(raw).toString(`utf8`));
      if (!_.isObject(message) || !(`type` in message) || message.type !== `open`) {
        return;
      }
      if (!(`id` in message) || !_.isNumber(message.id) || !(`port` in message) || !_.isNumber(message.port)) {
        return;
      }
      const { id, port } = message;
      opening.add(id);
      const local = net.connect({ host: HttpConstants.loopback, port }, () => {
        attach(id, local);
      });
      local.on(`error`, () => {
        opening.delete(id);
        pending.delete(id);
        socket.send(Json.stringify({ id, type: `close` }));
      });

      return;
    }
    const buffer = bytes(raw);
    if (buffer.length < idSize) {
      return;
    }
    const id = buffer.readUInt32BE(0);
    const chunk = buffer.subarray(idSize);
    const local = locals.get(id);
    if (local !== undefined) {
      local.write(chunk);

      return;
    }
    if (opening.has(id)) {
      pending.set(id, [...(pending.get(id) ?? []), chunk]);
    }
  });

  return {
    stop: () => {
      for (const local of locals.values()) {
        local.destroy();
      }
      socket.close();
    },
  };
};

describe(`proxy`, () => {
  it(`returns bad gateway when the client is offline`, async () => {
    const hub = TunnelHub({ key });
    const app = fastifyFactory();
    await hub.register(app, wsPath);
    app.post(`/probe`, async (_request, reply) => hub.proxy(reply, `/`, { json: {} }));
    await app.listen({ host: HttpConstants.loopback, port: 0 });

    const response = await app.inject({ method: `POST`, url: `/probe` });

    expect(response.statusCode).toBe(HttpStatus.badGateway);

    await app.close();
  });

  it(`forwards to the local server when a peer is online`, async () => {
    const local = HttpServer();
    const { port: localPort } = await local.start();
    local.on(local.respond({ body: { ok: true } }));

    const hub = TunnelHub({ key });
    const app = fastifyFactory();
    await hub.register(app, wsPath);
    app.post(`/probe`, async (_request, reply) => hub.proxy(reply, `/`, { json: { ping: true } }));
    await app.listen({ host: HttpConstants.loopback, port: 0 });
    const address = app.server.address();
    const hubPort = address !== null && typeof address === `object` ? address.port : 0;
    const client = await peer(`ws://${HttpConstants.loopback}:${hubPort}${wsPath}`, localPort);

    await expect
      .poll(async () => {
        const response = await app.inject({ method: `POST`, url: `/probe` });

        return response.statusCode;
      })
      .toBe(HttpStatus.ok);

    const response = await app.inject({ method: `POST`, url: `/probe` });

    expect(Json.parse(response.body)).toStrictEqual({ ok: true });
    expect(local.lastRequest()?.method).toBe(`POST`);

    client.stop();
    await app.close();
    await local.stop();
  });
});

describe(`register`, () => {
  it(`closes the socket when auth key is wrong`, async () => {
    const hub = TunnelHub({ key });
    const app = fastifyFactory();
    await hub.register(app, wsPath);
    await app.listen({ host: HttpConstants.loopback, port: 0 });
    const address = app.server.address();
    const hubPort = address !== null && typeof address === `object` ? address.port : 0;
    const socket = new ws(`ws://${HttpConstants.loopback}:${hubPort}${wsPath}`);
    await new Promise<void>((resolve, reject) => {
      socket.once(`open`, () => resolve());
      socket.once(`error`, reject);
    });

    const closed = new Promise<number>(resolve => {
      socket.once(`close`, resolve);
    });
    socket.send(Json.stringify({ key: `wrong`, type: `auth` }));

    await expect(closed).resolves.toBeTypeOf(`number`);

    await app.close();
  });
});
