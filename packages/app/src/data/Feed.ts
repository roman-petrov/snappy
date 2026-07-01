/* eslint-disable functional/no-expression-statements */
import type { TrpcClient, TrpcOutputs } from "@snappy/app-server-api";

import { Store } from "@snappy/core";
import { DataHook } from "@snappy/store";

export type FeedArtifact = TrpcOutputs[`feed`][`list`][`items`][number];

type FeedCreateInput = Parameters<TrpcClient[`feed`][`create`][`mutate`]>[0];

type FeedPage = { cursor: string | undefined; hasMore: boolean; items: FeedArtifact[] };

type FeedPatchInput = Parameters<TrpcClient[`feed`][`patch`][`mutate`]>[0];

type FeedRemoveInput = Parameters<TrpcClient[`feed`][`remove`][`mutate`]>[0];

type ListResponse = TrpcOutputs[`feed`][`list`];

export const Feed = (trpc: TrpcClient) => {
  const limit = 20;
  const $store = Store<FeedPage | undefined>(undefined);

  const pageOf = ({ items, nextCursor }: ListResponse): FeedPage => ({
    cursor: nextCursor,
    hasMore: nextCursor !== undefined,
    items,
  });

  const list = async (cursor?: string) => trpc.feed.list.query({ cursor, limit });

  const upsert = (artifact: FeedArtifact) => {
    const page = $store() ?? { cursor: undefined, hasMore: false, items: [] };
    const { items } = page;

    $store.set({
      ...page,
      items: items.some(item => item.id === artifact.id)
        ? items.map(item => (item.id === artifact.id ? artifact : item))
        : [artifact, ...items],
    });

    return artifact;
  };

  const append = async () => {
    const current = $store();

    if (current?.hasMore !== true) {
      return;
    }

    const next = pageOf(await list(current.cursor));
    $store.set({ ...next, items: [...current.items, ...next.items] });
  };

  const clear = () => $store.set(undefined);
  const create = async (input: FeedCreateInput) => upsert(await trpc.feed.create.mutate(input));
  const load = async () => $store.set(pageOf(await list()));
  const patch = async (input: FeedPatchInput) => upsert(await trpc.feed.patch.mutate(input));

  const remove = async ({ id }: FeedRemoveInput) => {
    await trpc.feed.remove.mutate({ id });

    const page = $store();

    if (page !== undefined) {
      $store.set({ ...page, items: page.items.filter(item => item.id !== id) });
    }
  };

  const feed = DataHook($store, page => ({ append, create, load, page, patch, remove }));

  return { clear, feed };
};
