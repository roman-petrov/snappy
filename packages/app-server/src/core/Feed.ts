import type { Db, DbFeedEvent } from "@snappy/db";

import { z } from "zod";

import { ImageRoute } from "./ImageRoute";
import { RpcScope } from "./RpcContract";

export const Feed = (db: Db) => {
  const { mut, query } = RpcScope.map<DbFeedEvent>(data =>
    `type` in data && data.type === `image` && data.src !== `` ? { ...data, src: ImageRoute.url(data.src) } : data,
  );

  const imageBody = z.object({ src: z.string().startsWith(`data:`), type: z.literal(`image`) });
  const textBody = z.object({ text: z.string(), type: z.literal(`text`) });

  const item = <T extends z.ZodRawShape>(extra: T) =>
    z.discriminatedUnion(`type`, [imageBody.extend(extra), textBody.extend(extra)]);

  const maxPageSize = 100;

  const create = mut(db.feed, item({ generationPrompt: z.string() }), async ({ dbUser, input }) =>
    dbUser.feed.create(input),
  );

  const list = query(
    z.object({ cursor: z.string().optional(), limit: z.number().int().min(1).max(maxPageSize) }),
    async ({ dbUser, input }) => dbUser.feed.list(input),
  );

  const patch = mut(item({ id: z.string() }), async ({ dbUser, input: { id, ...delta } }) =>
    dbUser.feed.patch(id, delta),
  );

  const remove = mut(z.object({ id: z.string() }), async ({ dbUser, input }) =>
    dbUser.feed.remove(input.id).then(() => input),
  );

  const rpc = { create, list, patch, remove };

  return { rpc };
};

export type Feed = ReturnType<typeof Feed>;
