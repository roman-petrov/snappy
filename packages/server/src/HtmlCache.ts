/* eslint-disable functional/no-expression-statements */
import type { HtmlCache as HtmlCacheFn } from "@snappy/server-module";

import { Cache } from "@snappy/core";
import { brotliCompressSync, gzipSync } from "node:zlib";

export const HtmlCache = (): HtmlCacheFn => {
  type Entry = { br: Buffer; gzip: Buffer; raw: Buffer };

  const store = Cache<Entry>();

  return async ({ contentType, key, load, reply }) => {
    const accept = reply.request.headers[`accept-encoding`];
    const hit = store.get(key);

    const cached =
      hit ??
      (await (async () => {
        const body = await load();
        const raw = Buffer.isBuffer(body) ? body : Buffer.from(body, `utf8`);

        return store.set(key, { br: brotliCompressSync(raw), gzip: gzipSync(raw), raw });
      })());

    const header = accept ?? ``;
    const encoding = header.includes(`br`) ? `br` : header.includes(`gzip`) ? `gzip` : undefined;
    const body = encoding === `br` ? cached.br : encoding === `gzip` ? cached.gzip : cached.raw;
    if (encoding !== undefined) {
      reply.header(`content-encoding`, encoding);
    }
    await reply.type(contentType).send(body);
  };
};
