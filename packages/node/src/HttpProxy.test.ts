/* @vitest-environment node */
/* eslint-disable unicorn/try-complexity */
import { HttpConstants, HttpStatus } from "@snappy/core";
import http from "node:http";
import { describe, expect, it } from "vitest";

import { HttpProxy } from "./HttpProxy";
import { HttpServer } from "./HttpServer";

const listen = async (server: http.Server) => {
  await new Promise<void>((resolve, reject) => {
    server.once(`error`, reject);
    server.listen(0, HttpConstants.loopback, () => {
      resolve();
    });
  });
  const address = server.address();
  if (address === null || typeof address === `string`) {
    throw new Error(`failed to bind`);
  }

  return address.port;
};

const close = async (server: http.Server) =>
  new Promise<void>((resolve, reject) => {
    server.close(error => (error === undefined ? resolve() : reject(error)));
  });

describe(`forward`, () => {
  it(`proxies HTTP to the target`, async () => {
    const upstream = HttpServer();
    const { port } = await upstream.start();
    upstream.on(upstream.respond({ body: { ok: true } }));

    const gateway = http.createServer();
    const proxy = HttpProxy({ hostname: HttpConstants.loopback, port, prefix: `/api`, server: gateway });
    gateway.on(`request`, (request, response) => {
      proxy.forward(request, response, request.url ?? `/`);
    });
    const gatewayPort = await listen(gateway);

    try {
      const response = await fetch(`http://${HttpConstants.loopback}:${gatewayPort}/api/ping`);

      expect(response.status).toBe(HttpStatus.ok);
      await expect(response.json()).resolves.toStrictEqual({ ok: true });
      expect(upstream.lastRequest()?.url).toBe(`/api/ping`);
    } finally {
      await close(gateway);
      await upstream.stop();
    }
  });
});

describe(`upgrade`, () => {
  it(`proxies websocket upgrade under prefix`, async () => {
    const upstream = http.createServer();
    let upgraded = false;
    upstream.on(`upgrade`, (request, socket, head) => {
      upgraded = request.url === `/api/rpc`;
      socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n\r\n`);
      if (head.length > 0) {
        socket.write(head);
      }
      socket.end();
    });
    const upstreamPort = await listen(upstream);
    const gateway = http.createServer();
    HttpProxy({ hostname: HttpConstants.loopback, port: upstreamPort, prefix: `/api`, server: gateway });
    const gatewayPort = await listen(gateway);

    try {
      const response = await new Promise<http.IncomingMessage>((resolve, reject) => {
        const request = http.request({
          headers: { connection: `Upgrade`, host: `${HttpConstants.loopback}:${gatewayPort}`, upgrade: `websocket` },
          hostname: HttpConstants.loopback,
          method: `GET`,
          path: `/api/rpc`,
          port: gatewayPort,
        });
        request.on(`upgrade`, (upgradeResponse, socket) => {
          socket.destroy();
          resolve(upgradeResponse);
        });
        request.on(`error`, reject);
        request.end();
      });

      expect(upgraded).toBe(true);
      expect(response.statusCode).toBe(101);
    } finally {
      await close(gateway);
      await close(upstream);
    }
  });
});
