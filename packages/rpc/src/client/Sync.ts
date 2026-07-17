/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statements */
/* eslint-disable init-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { _, type Store as StoreType } from "@snappy/core";
import { useEffect, useSyncExternalStore } from "react";

import {
  Sync as CoreSync,
  type ListsOf,
  type SyncDoc,
  type SyncDocEntry,
  type SyncLeaf,
  type SyncListMut,
  type SyncListPage,
} from "../Sync";

type AsProps<T> = { [K in keyof T]: T[K] };

type DocRead<TOut> = AsProps<SyncDoc<TOut>> & (() => TOut | undefined);

type DocsOf<TMap extends Record<string, SyncDocEntry>> = {
  [K in keyof TMap]: TMap[K] extends { read: SyncLeaf<[], infer TOut>; write: SyncLeaf<infer TWriteArgs> }
    ? DocWrite<TOut, TWriteArgs>
    : TMap[K] extends { read: SyncLeaf<[], infer TOut> }
      ? DocRead<TOut>
      : never;
};

type DocWrite<TOut, TWriteArgs extends unknown[]> = AsProps<SyncDoc<TOut, (...args: TWriteArgs) => Promise<TOut>>> &
  (() => readonly [TOut | undefined, (...args: TWriteArgs) => Promise<TOut>]);

type Mirror = {
  <TOut>(proc: SyncLeaf<[], TOut>): DocRead<TOut>;
  <TOut, TWriteArgs extends unknown[]>(
    proc: SyncLeaf<[], TOut>,
    config: { write: SyncLeaf<TWriteArgs, TOut> },
  ): DocWrite<TOut, TWriteArgs>;
};

type StoreWithWrite<T, TWrite> = StoreType<T> & { write: TWrite };

type Watch = {
  <T>(store: StoreType<T> & { write?: undefined }): Watched<T>;
  <T, TWrite>(store: StoreType<T> & { write: TWrite }): WatchedWrite<T, TWrite>;
};

type Watched<T> = AsProps<StoreType<T>> & (() => T);

type WatchedWrite<T, TWrite> = AsProps<StoreWithWrite<T, TWrite>> & { (): readonly [T, TWrite]; write: TWrite };

const watch = ((store: StoreType<unknown> & { write?: unknown }) =>
  Object.assign(() => {
    const value = useSyncExternalStore(store.subscribe, store, store);

    return store.write === undefined ? value : [value, store.write];
  }, store)) as Watch;

type ListItemInputOf<T> = T extends { read: (input: infer Input) => Promise<unknown> } ? Input : never;

type ListItemOf<T> = T extends { update: (input: infer Input) => Promise<infer Result> }
  ? readonly [ListItemOutOf<T> | undefined, (patch: Omit<Input, `id`>) => Promise<Result>]
  : ListItemOutOf<T> | undefined;

type ListItemOfPage<TPage> = TPage extends { items: (infer Item)[] } ? Item : never;

type ListItemOutOf<T> = T extends { read: (input: never) => Promise<infer Out> } ? Out : never;

type ListLoadInputOf<T> = T extends { load: (input?: infer Input) => Promise<void> } ? Input : undefined;

type ListMap = Parameters<ReturnType<typeof CoreSync.scope>[`lists`]>[0];

type ListMethodKey = `append` | `create` | `load` | `patch` | `read` | `remove` | `update`;

type ListPageOf<T> = T extends StoreType<infer Page> ? NonNullable<Page> : never;

type ListStore = SyncListMut &
  StoreType<SyncListPage<{ id: string }> | undefined> & {
    $item: StoreType<undefined | { id: string }>;
    append: () => Promise<void>;
    load: (input?: unknown) => Promise<void>;
  };

type ListsWithUseOf<TMap extends ListMap> = { [K in keyof ListsOf<TMap>]: ListWithUse<ListsOf<TMap>[K]> };

type ListViewOf<T> = Pick<ListPageOf<T>, Extract<keyof ListPageOf<T>, `cursor` | `nextCursor` | `page` | `total`>> &
  Pick<T, Extract<keyof T, ListMethodKey>> & { hasMore: boolean; items: ListItemOfPage<ListPageOf<T>>[] };

type ListWithUse<T> = AsProps<T> &
  ((input?: ListLoadInputOf<T>) => ListViewOf<T>) &
  ([ListItemInputOf<T>] extends [never] ? object : { item: (input: ListItemInputOf<T>) => ListItemOf<T> });

const watchList = (store: ListStore) => {
  let loaded: string | undefined;
  let pending: string | undefined;
  let itemKey: string | undefined;
  let itemPending: string | undefined;
  const { $item, append, create, load, patch, read, remove, subscribe, update } = store;

  const methods = {
    append,
    load,
    ...(create === undefined ? {} : { create }),
    ...(patch === undefined ? {} : { patch }),
    ...(read === undefined ? {} : { read }),
    ...(remove === undefined ? {} : { remove }),
    ...(update === undefined ? {} : { update }),
  };

  const use = (input?: unknown) => {
    const value = useSyncExternalStore(subscribe, store, store);
    const inputKey = input === undefined ? `` : JSON.stringify(input);
    const stale = value === undefined || loaded !== inputKey;

    useEffect(() => {
      if (stale && pending !== inputKey) {
        pending = inputKey;
        void (async () => {
          try {
            await load(input);
            loaded = inputKey;
          } catch {
            void 0;
          } finally {
            pending = undefined;
          }
        })();
      }
    }, [inputKey, stale]);

    const hasMore = value?.hasMore === true;
    const items = value?.items ?? [];
    const cursor = value?.cursor;
    const nextCursor = value?.nextCursor;
    const page = value?.page;
    const total = value?.total;

    return {
      ...methods,
      hasMore,
      items,
      ...(cursor === undefined ? {} : { cursor }),
      ...(nextCursor === undefined ? {} : { nextCursor }),
      ...(page === undefined ? {} : { page }),
      ...(total === undefined ? {} : { total }),
    };
  };

  return Object.assign(use, store, {
    ...(read === undefined
      ? {}
      : {
          item: (input: unknown) => {
            const value = useSyncExternalStore($item.subscribe, $item, $item);
            const inputKey = JSON.stringify(input);
            const id = input instanceof Object && `id` in input && _.isString(input.id) ? input.id : undefined;
            const stale = itemKey !== inputKey;
            const current = value?.id === id ? value : undefined;

            useEffect(() => {
              if (!stale || itemPending === inputKey) {
                return;
              }
              itemPending = inputKey;
              const cached = id === undefined ? undefined : store()?.items.find(row => row.id === id);
              if (cached !== undefined) {
                $item.set(cached);
              } else if (value?.id !== id) {
                $item.set(undefined);
              }
              void (async () => {
                try {
                  await read(input);
                  itemKey = inputKey;
                } catch {
                  void 0;
                } finally {
                  itemPending = undefined;
                }
              })();
            }, [inputKey, stale]);

            return update === undefined || id === undefined
              ? current
              : ([current, async (fields: object) => update({ ...fields, id })] as const);
          },
        }),
  });
};

const wrapMap = <TIn extends Record<string, unknown>, TOut>(map: TIn, wrap: (value: TIn[keyof TIn & string]) => TOut) =>
  _.mapEntries(map, (key, value) => [key, wrap(value as TIn[keyof TIn & string])]) as { [K in keyof TIn]: TOut };

const scope = ({
  api,
}: {
  api: { close: () => void; onReconnect?: (listener: () => void) => () => void; open: () => void };
}) => {
  const sync = CoreSync.scope({ api });

  const mirror = ((proc: SyncLeaf<[], never>, config?: { write?: SyncLeaf<never[], never> }) =>
    watch(
      (config?.write === undefined
        ? sync.mirror(proc)
        : sync.mirror(proc, { write: config.write })) as StoreType<unknown> & { write?: undefined },
    )) as Mirror;

  const docs = <const TMap extends Record<string, SyncDocEntry>>(map: TMap): DocsOf<TMap> =>
    wrapMap(sync.docs(map), value =>
      watch(value as StoreType<unknown> & { write?: undefined }),
    ) as unknown as DocsOf<TMap>;

  const lists = <const TMap extends ListMap>(map: TMap): ListsWithUseOf<TMap> =>
    wrapMap(sync.lists(map), value => watchList(value as unknown as ListStore)) as unknown as ListsWithUseOf<TMap>;

  const resources = <const TDocs extends Record<string, SyncDocEntry>, const TLists extends ListMap>(config: {
    docs?: TDocs;
    lists?: TLists;
  }): DocsOf<TDocs> & ListsWithUseOf<TLists> =>
    ({
      ...(config.docs === undefined ? {} : docs(config.docs)),
      ...(config.lists === undefined ? {} : lists(config.lists)),
    }) as DocsOf<TDocs> & ListsWithUseOf<TLists>;

  return { ...sync, docs, lists, mirror, resources };
};

export type SyncResourcesOf<T extends { docs?: Record<string, unknown>; lists?: Record<string, unknown> }> =
  (T extends { docs: infer TDocs extends Record<string, SyncDocEntry> } ? DocsOf<TDocs> : object) &
    (T extends { lists: infer TLists extends ListMap } ? ListsWithUseOf<TLists> : object);

export const Sync = { scope };
