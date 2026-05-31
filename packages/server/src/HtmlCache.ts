/* eslint-disable functional/no-expression-statements */
import type { FastifyReply } from "fastify";

import { Cache } from "@snappy/core";

export const HtmlCache = () => {
  const store = Cache<Buffer>();

  const replyCached = async (
    reply: FastifyReply,
    key: string,
    contentType: string,
    load: () => Buffer | Promise<Buffer | string> | string,
  ) => {
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

  return { replyCached };
};

export type HtmlCache = ReturnType<typeof HtmlCache>;
