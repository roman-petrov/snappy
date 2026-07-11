/* eslint-disable functional/no-expression-statements */
import type { StaticMount } from "@snappy/server-module";
import type { FastifyInstance } from "fastify";

import fastifyStatic, { type FastifyStaticOptions } from "@fastify/static";
import { _ } from "@snappy/core";

const register = async (app: FastifyInstance, mounts: StaticMount[]) => {
  type SetHeaders = NonNullable<FastifyStaticOptions[`setHeaders`]>;

  const hashedFile = (path: string) => /[-.]\w{8,}\./u.test(path.split(/[/\\]/u).at(-1) ?? ``);

  const setHeaders: SetHeaders = (reply, path) => {
    if (hashedFile(path)) {
      reply.header(`Cache-Control`, `public, max-age=${_.day.seconds * _.daysInYear}, immutable`);
    }
  };

  const shared = { index: false as const, preCompressed: true as const, setHeaders };

  const step = async (index: number): Promise<void> => {
    const mount = mounts[index];
    if (mount === undefined) {
      return;
    }
    await app.register(fastifyStatic, {
      ...shared,
      decorateReply: index > 0 ? false : undefined,
      prefix: mount.prefix,
      root: mount.root,
    });
    await step(index + 1);
  };

  await step(0);
};

export const Static = { register };
