/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-try-statements */
import type { S3CoreUser } from "@snappy/s3-core";

import { Png } from "@snappy/core";

import type { FeedArtifact, PrismaClient } from "./generated/client";

import { DbCoreLive } from "./DbCoreLive";

export type DbCoreFeedArtifact = DbCoreFeedPatch & { generationPrompt: string; id: string };

export type DbCoreFeedCreate = DbCoreFeedPatch & { generationPrompt: string };

export type DbCoreFeedEvent = DbCoreFeedArtifact | { id: string };

export type DbCoreFeedPatch = { src: string; type: `image` } | { text: string; type: `text` };

export const DbCoreFeed = DbCoreLive<DbCoreFeedEvent>().from(
  (_prisma: PrismaClient, storage: S3CoreUser) => storage.id,
  (emit, prisma, storage) => {
    const userId = storage.id;
    const s3 = (file: string) => `feed/${file}`;

    const fromRow = ({ generationPrompt, id, src, text, type }: FeedArtifact): DbCoreFeedArtifact =>
      type === `image` ? { generationPrompt, id, src, type: `image` } : { generationPrompt, id, text, type: `text` };

    const publish = (row: FeedArtifact) => {
      const item = fromRow(row);
      emit(item);

      return item;
    };

    const storePng = async (src: string) => {
      const file = `${crypto.randomUUID()}${Png.suffix}`;
      await storage.putPng(s3(file), src);

      return file;
    };

    const list = async ({ cursor, limit }: { cursor?: string; limit: number }) => {
      const [at, id] = cursor?.split(`|`) ?? [];
      const createdAt = at === undefined ? undefined : new Date(at);

      const rows = await prisma.feedArtifact.findMany({
        orderBy: [{ createdAt: `desc` }, { id: `desc` }],
        take: limit,
        where: {
          userId,
          ...(createdAt === undefined
            ? {}
            : { OR: [{ createdAt: { lt: createdAt } }, { createdAt, id: { lt: id ?? `` } }] }),
        },
      });

      const last = rows.at(-1);

      return {
        items: rows.map(fromRow),
        nextCursor:
          rows.length === limit && last !== undefined ? `${last.createdAt.toISOString()}|${last.id}` : undefined,
      };
    };

    const create = async (input: DbCoreFeedCreate) => {
      if (input.type === `image`) {
        const id = crypto.randomUUID();
        const file = await storePng(input.src);

        try {
          return publish(await prisma.feedArtifact.create({ data: { ...input, id, src: file, userId } }));
        } catch (error) {
          await storage.remove(s3(file));
          throw error;
        }
      }

      return publish(await prisma.feedArtifact.create({ data: { ...input, userId } }));
    };

    const patch = async (id: string, delta: DbCoreFeedPatch) => {
      if (delta.type === `image`) {
        const row = await prisma.feedArtifact.findUnique({ where: { id, userId } });
        if (row === null) {
          throw new Error(`Feed artifact missing`);
        }

        const file = await storePng(delta.src);
        if (row.src !== ``) {
          await storage.remove(s3(row.src));
        }

        return publish(await prisma.feedArtifact.update({ data: { src: file }, where: { id, userId } }));
      }

      return publish(await prisma.feedArtifact.update({ data: { text: delta.text }, where: { id, userId } }));
    };

    const remove = async (id: string) => {
      const row = await prisma.feedArtifact.findUnique({ where: { id, userId } });
      if (row === null) {
        return;
      }

      await prisma.feedArtifact.delete({ where: { id, userId } });
      if (row.type === `image` && row.src !== ``) {
        await storage.remove(s3(row.src));
      }
      emit({ id });
    };

    const image = async (file: string) => {
      const row = await prisma.feedArtifact.findFirst({ where: { src: file, type: `image`, userId } });

      return row === null ? undefined : storage.stream(s3(file));
    };

    return { create, image, list, patch, remove };
  },
);

export type DbCoreFeed = ReturnType<typeof DbCoreFeed>;
