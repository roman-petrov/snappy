/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-try-statements */
import type { S3CoreUser } from "@snappy/s3-core";

import type { FeedArtifact, PrismaClient } from "./generated/client";

export type DbCoreFeedArtifact = DbCoreFeedPatch & { generationPrompt: string; id: string };

export type DbCoreFeedCreate = DbCoreFeedPatch & { generationPrompt: string };

export type DbCoreFeedPatch = { src: string; type: `image` } | { text: string; type: `text` };

export const DbCoreFeed = (prisma: PrismaClient, storage: S3CoreUser) => {
  const imagePath = (id: string) => `feed/${id}.png`;
  const imageBytes = (dataUrl: string) => Buffer.from(dataUrl.split(`,`)[1] ?? ``, `base64`);

  const toArtifact = async ({ generationPrompt, id, src, text, type }: FeedArtifact): Promise<DbCoreFeedArtifact> =>
    type === `image`
      ? { generationPrompt, id, src: src === `` ? `` : await storage.url(src), type: `image` }
      : { generationPrompt, id, text, type: `text` };

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
    const items = await Promise.all(rows.map(toArtifact));
    const nextCursor = rows.length === limit && last !== undefined ? encodeCursor(last) : undefined;

    return { items, nextCursor };
  };

  const create = async (artifact: DbCoreFeedCreate) => {
    if (artifact.type === `image`) {
      const id = crypto.randomUUID();
      const path = imagePath(id);
      await storage.put(path, imageBytes(artifact.src), `image/png`);

      const data = { ...artifact, id, src: path, userId: storage.id };

      try {
        return await toArtifact(await prisma.feedArtifact.create({ data }));
      } catch (error) {
        await storage.remove(path);
        throw error;
      }
    }

    return toArtifact(await prisma.feedArtifact.create({ data: { ...artifact, userId: storage.id } }));
  };

  const patch = async (id: string, delta: DbCoreFeedPatch) => {
    if (delta.type === `image`) {
      const path = imagePath(id);
      await storage.put(path, imageBytes(delta.src), `image/png`);

      return toArtifact(await prisma.feedArtifact.update({ data: { src: path }, where: { id, userId: storage.id } }));
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
      await storage.remove(row.src);
    }
  };

  return { create, list, patch, remove };
};

export type DbCoreFeed = ReturnType<typeof DbCoreFeed>;
