/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { Server as HttpsServer } from "node:https";
import type { Duplex } from "node:stream";

import { _, HttpStatus } from "@snappy/core";
import http, { type Server as HttpServer, type IncomingMessage, type ServerResponse } from "node:http";

export type HttpProxyConfig = { hostname: string; port: number; prefix: string; server: HttpServer | HttpsServer };

export const HttpProxy = ({ hostname, port, prefix, server }: HttpProxyConfig) => {
  const host = `${hostname}:${port}`;

  const forward = (incoming: IncomingMessage, response: ServerResponse, path: string) => {
    const proxyRequest = http.request(
      { headers: { ...incoming.headers, host }, hostname, method: incoming.method, path, port },
      proxyResponse => {
        response.writeHead(proxyResponse.statusCode ?? HttpStatus.badGateway, proxyResponse.headers);
        proxyResponse.pipe(response);
      },
    );
    proxyRequest.on(`error`, () => {
      response.statusCode = HttpStatus.badGateway;
      response.end(`proxy error`);
    });
    incoming.pipe(proxyRequest);
  };

  server.on(`upgrade`, (request, socket: Duplex, head) => {
    const { headers, url } = request;
    if (url === undefined || !url.startsWith(prefix)) {
      return;
    }

    const proxyRequest = http.request({ headers: { ...headers, host }, hostname, method: `GET`, path: url, port });

    proxyRequest.on(`upgrade`, (proxyResponse, proxySocket, proxyHead) => {
      socket.write(
        `HTTP/1.1 101 Switching Protocols\r\n${Object.entries(proxyResponse.headers)
          .flatMap(([name, value]) =>
            value === undefined
              ? []
              : (_.isArray(value) ? value : [value]).filter(_.isString).map(item => `${name}: ${item}`),
          )
          .join(`\r\n`)}\r\n\r\n`,
      );
      if (proxyHead.length > 0) {
        socket.write(proxyHead);
      }
      if (head.length > 0) {
        proxySocket.write(head);
      }
      proxySocket.pipe(socket);
      socket.pipe(proxySocket);
    });
    proxyRequest.on(`error`, () => {
      socket.destroy();
    });
    proxyRequest.on(`response`, () => {
      socket.destroy();
    });
    proxyRequest.end();
  });

  return { forward };
};

export type HttpProxy = ReturnType<typeof HttpProxy>;
