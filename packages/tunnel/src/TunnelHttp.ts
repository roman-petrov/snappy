/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable unicorn/no-null */
import type { Duplex } from "node:stream";

import { HttpConstants, HttpStatus, Json, MimeType } from "@snappy/core";
import http from "node:http";

export type TunnelConnect = () => Duplex | Promise<Duplex>;

export type TunnelFetchInit = { json?: unknown };

const fetch = async (connect: TunnelConnect, path: string, init: TunnelFetchInit = {}) => {
  const { body, headers } =
    init.json === undefined
      ? { body: undefined, headers: undefined }
      : { body: Buffer.from(Json.stringify(init.json)), headers: { "content-type": MimeType.json } };

  const socket = await connect();
  const { promise, reject, resolve } = Promise.withResolvers<Response>();

  const request = http.request(
    {
      createConnection: (_options, callback) => {
        callback(null, socket);

        return socket;
      },
      headers,
      host: HttpConstants.loopback,
      method: `POST`,
      path,
    },
    message => {
      const chunks: Buffer[] = [];
      message.on(`data`, (chunk: Buffer | string) => chunks.push(Buffer.from(chunk)));
      message.on(`end`, () => {
        resolve(
          new Response(Buffer.concat(chunks), {
            headers: message.headers as HeadersInit,
            status: message.statusCode ?? HttpStatus.badGateway,
          }),
        );
      });
    },
  );
  request.on(`error`, reject);
  if (body !== undefined) {
    request.write(body);
  }
  request.end();

  return promise;
};

export const TunnelHttp = { fetch };
