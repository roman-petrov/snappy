/* eslint-disable init-declarations */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
import { HttpStatus } from "@snappy/core";
import {
  createServer,
  type IncomingHttpHeaders,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import { gzipSync } from "node:zlib";

export const HttpServer = () => {
  type Body = (Buffer | string)[] | Buffer | string;

  type Handler = (request: IncomingMessage, response: ServerResponse) => void;

  type RequestRecord = { headers: IncomingHttpHeaders; method: string; url: string };

  const host = `http://127.0.0.1`;
  const gzipChunkSize = 16_384;
  const chunks = (body: Body): (Buffer | string)[] => (Array.isArray(body) ? body : [body]);

  const write = (response: ServerResponse, status: number, headers: Record<string, string>, body: Body) => {
    response.writeHead(status, headers);
    for (const chunk of chunks(body)) {
      response.write(chunk);
    }
    response.end();
  };

  const requests: RequestRecord[] = [];
  let server: Server | undefined;
  let handler: Handler | undefined;

  const start = async () => {
    const bound = await new Promise<{ port: number; url: string }>((resolve, reject) => {
      server = createServer((request, response) => {
        const { headers, method = `GET`, url: requestUrl = `/` } = request;
        const { pathname } = new URL(requestUrl, host);
        requests.push({ headers, method, url: pathname });
        if (handler === undefined) {
          response.statusCode = HttpStatus.notFound;
          response.end(`not found`);

          return;
        }
        handler(request, response);
      });

      server.once(`error`, reject);
      server.listen(0, `127.0.0.1`, () => {
        const address = server?.address();
        if (address === null || address === undefined || typeof address === `string`) {
          reject(new Error(`http server failed to bind`));

          return;
        }
        const { port } = address;
        resolve({ port, url: `${host}:${port}` });
      });
    });

    return bound;
  };

  const stop = async () => {
    await new Promise<void>((resolve, reject) => {
      if (server === undefined) {
        resolve();

        return;
      }
      server.close(error => (error === undefined ? resolve() : reject(error)));
    });
    server = undefined;
    handler = undefined;
  };

  const on = (fn: Handler) => {
    handler = fn;
  };

  const json =
    (body: unknown, status: number = HttpStatus.ok, headers: Record<string, string> = {}) =>
    (_request: IncomingMessage, response: ServerResponse) => {
      write(response, status, { "content-type": `application/json`, ...headers }, JSON.stringify(body));
    };

  const raw =
    (body: Body, status: number = HttpStatus.ok, headers: Record<string, string> = {}) =>
    (_request: IncomingMessage, response: ServerResponse) => {
      write(response, status, headers, body);
    };

  const sse = (lines: string[], headers: Record<string, string> = {}) =>
    raw(lines.join(`\n`), HttpStatus.ok, { "content-type": `text/event-stream; charset=utf-8`, ...headers });

  const gzipJson = (body: unknown, headers: Record<string, string> = {}) => {
    const compressed = gzipSync(JSON.stringify(body));
    const partCount = Math.ceil(compressed.length / gzipChunkSize);

    const parts = Array.from({ length: partCount }, (_, index) =>
      compressed.subarray(index * gzipChunkSize, (index + 1) * gzipChunkSize),
    );

    return raw(parts, HttpStatus.ok, {
      "content-encoding": `gzip`,
      "content-type": `application/json; charset=utf-8`,
      ...headers,
    });
  };

  const abort = () => (_request: IncomingMessage, response: ServerResponse) => {
    response.writeHead(HttpStatus.ok, { "content-type": `application/json` });
    response.write(`{"partial":`);
    queueMicrotask(() => {
      response.socket?.destroy(new Error(`upstream`));
    });
  };

  const lastRequest = () => requests.at(-1);

  return { abort, gzipJson, json, lastRequest, on, raw, sse, start, stop };
};

export type HttpServer = ReturnType<typeof HttpServer>;
