/* eslint-disable init-declarations */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { FastifyReply, FastifyRequest } from "fastify";

import { _, Cache } from "@snappy/core";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";

export type CachedEntry = { brotli?: Buffer; gzip?: Buffer; raw: Buffer };

type SendTarget = {
  header: (name: string, value: string) => SendTarget;
  send: (body: Buffer | string) => SendTarget;
  type: (t: string) => SendTarget;
};

export const ServerCache = () => {
  const store = Cache<CachedEntry>();

  const compressible = (contentType: string) => {
    const base = contentType.split(`;`)[0]?.trim().toLowerCase() ?? ``;

    return (
      base.startsWith(`text/`) ||
      base === `application/javascript` ||
      base === `application/json` ||
      base === `application/xml` ||
      base === `image/svg+xml`
    );
  };

  const compress = (raw: Buffer) => ({ brotli: brotliCompressSync(raw), gzip: gzipSync(raw) });

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

  const contentTypeFromPath = (pathname: string) => {
    const lastDot = pathname.lastIndexOf(`.`);
    const ext = lastDot === -1 ? `` : pathname.slice(lastDot + 1).toLowerCase();

    return contentTypesByExt[ext] ?? `application/octet-stream`;
  };

  const hasHashInPath = (pathname: string) => /[-.]\w{8,}\./u.test(pathname.split(`/`).pop() ?? ``);
  const { get, remove } = store;

  const set = (key: string, raw: Buffer, contentType = `application/octet-stream`): CachedEntry => {
    const entry: CachedEntry = { raw };
    if (compressible(contentType)) {
      const { brotli, gzip } = compress(raw);
      entry.brotli = brotli;
      entry.gzip = gzip;
    }

    return store.set(key, entry);
  };

  const preferredEncoding = (acceptEncoding: string | undefined) =>
    acceptEncoding === undefined
      ? undefined
      : acceptEncoding.toLowerCase().includes(`br`)
        ? `br`
        : acceptEncoding.toLowerCase().includes(`gzip`)
          ? `gzip`
          : undefined;

  const sendCached = (
    target: SendTarget,
    entry: CachedEntry,
    acceptEncoding: string | undefined,
    contentType: string,
    pathname = ``,
  ) => {
    target.type(contentType);
    target.header(`Vary`, `Accept-Encoding`);
    if (pathname !== `` && hasHashInPath(pathname)) {
      target.header(`Cache-Control`, `public, max-age=${_.day.seconds * _.daysInYear}, immutable`);
    }
    const enc = preferredEncoding(acceptEncoding);
    if (enc === `br` && entry.brotli !== undefined) {
      target.header(`Content-Encoding`, `br`);
      target.send(entry.brotli);

      return;
    }
    if (enc === `gzip` && entry.gzip !== undefined) {
      target.header(`Content-Encoding`, `gzip`);
      target.send(entry.gzip);

      return;
    }
    target.send(entry.raw);
  };

  const pathnameFromRequest = (request: FastifyRequest) => {
    const { url } = request;
    const path = url.includes(`?`) ? url.slice(0, url.indexOf(`?`)) : url;

    return path.startsWith(`/`) ? path : `/${path}`;
  };

  const serveFromRoot = (
    request: FastifyRequest,
    reply: FastifyReply,
    next: () => void,
    root: string,
    pathname: string,
  ) => {
    const rootResolved = resolve(root);
    const relative = pathname.startsWith(`/`) ? pathname.slice(1) : pathname;
    const filePath = resolve(root, relative);

    if (!filePath.startsWith(rootResolved)) {
      next();

      return;
    }
    const key = `static:${pathname}`;
    const cached = get(key);
    if (cached !== undefined) {
      sendCached(reply, cached, request.headers[`accept-encoding`], contentTypeFromPath(pathname), pathname);

      return;
    }
    let raw: Buffer | undefined;
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
    sendCached(reply, entry, request.headers[`accept-encoding`], contentType, pathname);
  };

  const createStatic =
    (root: string) =>
    (request: FastifyRequest, reply: FastifyReply, next: () => void): void =>
      serveFromRoot(request, reply, next, root, pathnameFromRequest(request));

  const createStaticWithPrefix =
    (root: string, prefix: string) =>
    (request: FastifyRequest, reply: FastifyReply, next: () => void): void => {
      const path = pathnameFromRequest(request);
      if (!path.startsWith(prefix)) {
        next();

        return;
      }
      const pathname = path.slice(prefix.length) || `/`;

      serveFromRoot(request, reply, next, root, pathname);
    };

  return { createStatic, createStaticWithPrefix, get, pathnameFromRequest, remove, sendCached, set };
};

export type ServerCache = ReturnType<typeof ServerCache>;
