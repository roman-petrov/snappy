/* eslint-disable functional/no-expression-statements */
import type { HtmlCache as HtmlCacheFn } from "@snappy/server-module";

import { Cache } from "@snappy/core";

export const HtmlCache = (): HtmlCacheFn => {
  const store = Cache<Buffer>();

  return async ({ contentType, key, load, reply }) => {
    const cached = store.get(key);
    if (cached !== undefined) {
      await reply.type(contentType).send(cached);

      return;
    }
    const body = await load();
    const buffer = Buffer.isBuffer(body) ? body : Buffer.from(body, `utf8`);
    store.set(key, buffer);
    await reply.type(contentType).send(buffer);
  };
};
