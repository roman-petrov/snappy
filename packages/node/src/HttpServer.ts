/* eslint-disable init-declarations */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
import { _, HttpStatus, MimeType } from "@snappy/core";
import {
  createServer,
  type IncomingHttpHeaders,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import { gzipSync, zstdCompressSync } from "node:zlib";

export type HttpServerBody = (Buffer | string)[] | Buffer | string;

export type HttpServerReply = {
  body: unknown;
  contentType?: string;
  encoding?: `gzip` | `zstd`;
  headers?: Record<string, string>;
  status?: number;
};

export const HttpServer = () => {
  type Handler = (request: IncomingMessage, response: ServerResponse) => void;

  type RequestRecord = { headers: IncomingHttpHeaders; method: string; url: string };

  const host = `http://127.0.0.1`;
  const chunkSize = 16_384;
  const parts = (body: HttpServerBody): (Buffer | string)[] => (_.isArray(body) ? body : [body]);

  const isRawBody = (body: unknown): body is HttpServerBody =>
    _.isString(body) ||
    Buffer.isBuffer(body) ||
    (_.isArray(body) && body.every(part => _.isString(part) || Buffer.isBuffer(part)));

  const toBytes = (body: unknown) =>
    Buffer.isBuffer(body)
      ? body
      : _.isString(body)
        ? Buffer.from(body)
        : _.isArray(body)
          ? Buffer.concat(
              body.map(part => (Buffer.isBuffer(part) ? part : Buffer.from(_.isString(part) ? part : String(part)))),
            )
          : Buffer.from(JSON.stringify(body));

  const chunked = (bytes: Buffer): HttpServerBody => {
    const partCount = Math.ceil(bytes.length / chunkSize);

    return partCount <= 1
      ? bytes
      : _.gen(partCount, index => bytes.subarray(index * chunkSize, (index + 1) * chunkSize));
  };

  const write = (response: ServerResponse, status: number, headers: Record<string, string>, body: HttpServerBody) => {
    response.writeHead(status, headers);
    for (const chunk of parts(body)) {
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
        if (address === null || address === undefined || _.isString(address)) {
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

  const respond =
    ({ body, contentType, encoding, headers = {}, status = HttpStatus.ok }: HttpServerReply) =>
    (_request: IncomingMessage, response: ServerResponse) => {
      const payload =
        encoding === undefined
          ? isRawBody(body)
            ? body
            : JSON.stringify(body)
          : chunked(encoding === `gzip` ? gzipSync(toBytes(body)) : zstdCompressSync(toBytes(body)));

      const type = contentType ?? (isRawBody(body) ? undefined : MimeType.json);

      write(
        response,
        status,
        {
          ...(type === undefined ? {} : { "content-type": type }),
          ...(encoding === undefined ? {} : { "content-encoding": encoding }),
          ...headers,
        },
        payload,
      );
    };

  const sse = (lines: string[], headers: Record<string, string> = {}) =>
    respond({ body: lines.join(`\n`), contentType: `text/event-stream; charset=utf-8`, headers });

  const abort = () => (_request: IncomingMessage, response: ServerResponse) => {
    response.writeHead(HttpStatus.ok, { "content-type": MimeType.json });
    response.write(`{"partial":`);
    queueMicrotask(() => {
      response.socket?.destroy(new Error(`upstream`));
    });
  };

  const lastRequest = () => requests.at(-1);

  return { abort, lastRequest, on, respond, sse, start, stop };
};

export type HttpServer = ReturnType<typeof HttpServer>;
