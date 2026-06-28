import type { DbFeedArtifact } from "@snappy/db";

import { z } from "zod";

import { AppTrpcAuth } from "./AppTrpc";
import { ImageRoute } from "./ImageRoute";

const imageBody = z.object({ src: z.string().startsWith(`data:`), type: z.literal(`image`) });
const textBody = z.object({ text: z.string(), type: z.literal(`text`) });

const feedInput = <T extends z.ZodRawShape>(extra: T) =>
  z.discriminatedUnion(`type`, [imageBody.extend(extra), textBody.extend(extra)]);

const createInput = feedInput({ generationPrompt: z.string() });
const patchInput = feedInput({ id: z.string() });
const maxPageSize = 100;

const withImageUrl = (artifact: DbFeedArtifact): DbFeedArtifact =>
  artifact.type === `image` && artifact.src !== `` ? { ...artifact, src: ImageRoute.url(artifact.src) } : artifact;

const create = AppTrpcAuth.input(createInput).mutation(async ({ ctx, input }) =>
  withImageUrl(await ctx.dbUser.feed.create(input)),
);

const list = AppTrpcAuth.input(
  z.object({ cursor: z.string().optional(), limit: z.number().int().min(1).max(maxPageSize) }),
).query(async ({ ctx, input }) => {
  const page = await ctx.dbUser.feed.list(input);

  return { ...page, items: page.items.map(withImageUrl) };
});

const patch = AppTrpcAuth.input(patchInput).mutation(async ({ ctx, input: { id, ...delta } }) =>
  withImageUrl(await ctx.dbUser.feed.patch(id, delta)),
);

const remove = AppTrpcAuth.input(z.object({ id: z.string() })).mutation(async ({ ctx, input: { id } }) =>
  ctx.dbUser.feed.remove(id),
);

const trpc = { create, list, patch, remove };

export const Feed = { trpc };

export type Feed = typeof Feed;
