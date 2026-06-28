/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-try-statements */
import type { S3CoreUser } from "@snappy/s3-core";

import { MimeType } from "@snappy/core";

import type { FeedArtifact, PrismaClient } from "./generated/client";

export type DbCoreFeedArtifact = DbCoreFeedPatch & { generationPrompt: string; id: string };

export type DbCoreFeedCreate = DbCoreFeedPatch & { generationPrompt: string };

export type DbCoreFeedPatch = { src: string; type: `image` } | { text: string; type: `text` };

export const DbCoreFeed = (prisma: PrismaClient, storage: S3CoreUser) => {
  const s3Path = (file: string) => `feed/${file}`;
  const pngFile = () => `${crypto.randomUUID()}${MimeType.pngSuffix}`;

  const toArtifact = ({ generationPrompt, id, src, text, type }: FeedArtifact): DbCoreFeedArtifact =>
    type === `image` ? { generationPrompt, id, src, type: `image` } : { generationPrompt, id, text, type: `text` };

  const parseCursor = (cursor: string) => {
    const [createdAt, id] = cursor.split(`|`);

    return { createdAt: new Date(createdAt ?? ``), id: id ?? `` };
  };

  const encodeCursor = ({ createdAt, id }: { createdAt: Date; id: string }) => `${createdAt.toISOString()}|${id}`;

  const list = async ({ cursor, limit }: { cursor?: string; limit: number }) => {
    const parsed = cursor === undefined ? undefined : parseCursor(cursor);

    const cursorWhere =
      parsed === undefined
        ? {}
        : { OR: [{ createdAt: { lt: parsed.createdAt } }, { createdAt: parsed.createdAt, id: { lt: parsed.id } }] };

    const rows = await prisma.feedArtifact.findMany({
      orderBy: [{ createdAt: `desc` }, { id: `desc` }],
      take: limit,
      where: { userId: storage.id, ...cursorWhere },
    });

    const last = rows.at(-1);
    const items = rows.map(toArtifact);
    const nextCursor = rows.length === limit && last !== undefined ? encodeCursor(last) : undefined;

    return { items, nextCursor };
  };

  const create = async (artifact: DbCoreFeedCreate) => {
    if (artifact.type === `image`) {
      const id = crypto.randomUUID();
      const file = pngFile();
      const path = s3Path(file);
      await storage.putPng(path, artifact.src);

      const data = { ...artifact, id, src: file, userId: storage.id };

      try {
        return toArtifact(await prisma.feedArtifact.create({ data }));
      } catch (error) {
        await storage.remove(path);
        throw error;
      }
    }

    return toArtifact(await prisma.feedArtifact.create({ data: { ...artifact, userId: storage.id } }));
  };

  const patch = async (id: string, delta: DbCoreFeedPatch) => {
    if (delta.type === `image`) {
      const row = await prisma.feedArtifact.findUnique({ where: { id, userId: storage.id } });

      if (row === null) {
        throw new Error(`Feed artifact missing`);
      }

      const file = pngFile();
      const path = s3Path(file);
      await storage.putPng(path, delta.src);

      if (row.src !== ``) {
        await storage.remove(s3Path(row.src));
      }

      return toArtifact(await prisma.feedArtifact.update({ data: { src: file }, where: { id, userId: storage.id } }));
    }

    return toArtifact(
      await prisma.feedArtifact.update({ data: { text: delta.text }, where: { id, userId: storage.id } }),
    );
  };

  const remove = async (id: string) => {
    const row = await prisma.feedArtifact.findUnique({ where: { id, userId: storage.id } });
    if (row === null) {
      return;
    }

    await prisma.feedArtifact.delete({ where: { id, userId: storage.id } });

    if (row.type === `image` && row.src !== ``) {
      await storage.remove(s3Path(row.src));
    }
  };

  const image = async (file: string) => {
    const row = await prisma.feedArtifact.findFirst({ where: { src: file, type: `image`, userId: storage.id } });

    return row === null ? undefined : storage.stream(s3Path(file));
  };

  return { create, image, list, patch, remove };
};

export type DbCoreFeed = ReturnType<typeof DbCoreFeed>;
