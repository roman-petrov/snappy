/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { RequestHandler } from "express";

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";

export type CachedEntry = { brotli?: Buffer; gzip?: Buffer; raw: Buffer };

const compressible = (contentType: string): boolean => {
  const base = contentType.split(`;`)[0]?.trim().toLowerCase() ?? ``;

  return (
    base.startsWith(`text/`) ||
    base === `application/javascript` ||
    base === `application/json` ||
    base === `application/xml` ||
    base === `image/svg+xml`
  );
};

const compress = (raw: Buffer): { brotli: Buffer; gzip: Buffer } => ({
  brotli: brotliCompressSync(raw),
  gzip: gzipSync(raw),
});

const contentTypesByExt: Record<string, string> = {
  css: `text/css`,
  html: `text/html`,
  ico: `image/x-icon`,
  js: `application/javascript`,
  json: `application/json`,
  mjs: `application/javascript`,
  png: `image/png`,
  svg: `image/svg+xml`,
  txt: `text/plain`,
  woff2: `font/woff2`,
  xml: `application/xml`,
};

const contentTypeFromPath = (pathname: string): string => {
  const lastDot = pathname.lastIndexOf(`.`);
  const ext = lastDot === -1 ? `` : pathname.slice(lastDot + 1).toLowerCase();

  return contentTypesByExt[ext] ?? `application/octet-stream`;
};

type SendResponse = {
  send: (body: Buffer | string) => void;
  setHeader: (name: string, value: string) => SendResponse;
  type: (t: string) => SendResponse;
};

export const ServerCache = () => {
  const store = new Map<string, CachedEntry>();
  const get = (key: string): CachedEntry | undefined => store.get(key);

  const set = (key: string, raw: Buffer, contentType = `application/octet-stream`): CachedEntry => {
    const entry: CachedEntry = { raw };
    if (compressible(contentType)) {
      const { brotli, gzip } = compress(raw);
      entry.brotli = brotli;
      entry.gzip = gzip;
    }
    store.set(key, entry);

    return entry;
  };

  const deleteKey = (key: string): void => {
    store.delete(key);
  };

  const preferredEncoding = (acceptEncoding: string | undefined): `br` | `gzip` | undefined => {
    if (acceptEncoding === undefined) {
      return undefined;
    }
    const s = acceptEncoding.toLowerCase();
    if (s.includes(`br`)) {
      return `br`;
    }
    if (s.includes(`gzip`)) {
      return `gzip`;
    }

    return undefined;
  };

  const sendCached = (
    response: SendResponse,
    entry: CachedEntry,
    acceptEncoding: string | undefined,
    contentType: string,
  ): void => {
    response.type(contentType);
    response.setHeader(`Vary`, `Accept-Encoding`);
    const enc = preferredEncoding(acceptEncoding);
    if (enc === `br` && entry.brotli !== undefined) {
      response.setHeader(`Content-Encoding`, `br`);
      response.send(entry.brotli);

      return;
    }
    if (enc === `gzip` && entry.gzip !== undefined) {
      response.setHeader(`Content-Encoding`, `gzip`);
      response.send(entry.gzip);

      return;
    }
    response.send(entry.raw);
  };

  const createStatic = (root: string): RequestHandler => {
    const rootResolved = resolve(root);

    return (request, response, next) => {
      const pathname = request.path || `/`;
      const relative = pathname.startsWith(`/`) ? pathname.slice(1) : pathname;
      const filePath = resolve(root, relative);

      if (!filePath.startsWith(rootResolved)) {
        next();

        return;
      }

      const key = `static:${pathname}`;
      const cached = get(key);
      if (cached !== undefined) {
        sendCached(response, cached, request.headers[`accept-encoding`], contentTypeFromPath(pathname));

        return;
      }

      let raw: Buffer | undefined = undefined;
      try {
        raw = readFileSync(filePath);
      } catch {
        raw = undefined;
      }
      if (raw === undefined) {
        next();

        return;
      }
      const contentType = contentTypeFromPath(pathname);
      const entry = set(key, raw, contentType);
      sendCached(response, entry, request.headers[`accept-encoding`], contentType);
    };
  };

  return { createStatic, delete: deleteKey, get, sendCached, set };
};

export type ServerCache = ReturnType<typeof ServerCache>;
