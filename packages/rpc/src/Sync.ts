/* eslint-disable unicorn/try-complexity */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-try-statements */
/* eslint-disable init-declarations */
import { _, Store, type Store as StoreType } from "@snappy/core";

export type ListsOf<TMap extends Record<string, ListEntry>> = {
  [K in keyof TMap]: ListMethodsOf<TMap[K]> & StoreType<SyncListPage<ListItemOf<TMap[K][`list`]>> | undefined>;
};

export type SyncDoc<TOut, TWrite = undefined> = StoreType<TOut | undefined> & {
  clear: () => void;
  load: () => Promise<TOut>;
} & ([TWrite] extends [undefined] ? unknown : { write: TWrite });

export type SyncDocEntry = { read: SyncLeaf<[]>; write?: SyncLeaf<never[]> };

export type SyncLeaf<TArgs extends unknown[] = unknown[], TOut = unknown> = ((...args: TArgs) => Promise<TOut>) & {
  on: (listener: (data: TOut) => void) => () => void;
};

export type SyncListMut = {
  create?: (input: unknown) => Promise<unknown>;
  patch?: (input: unknown) => Promise<unknown>;
  read?: (input: unknown) => Promise<unknown>;
  remove?: (input: unknown) => Promise<unknown>;
  update?: (input: unknown) => Promise<unknown>;
};

export type SyncListPage<TItem extends { id: string }> = {
  cursor?: string;
  hasMore?: boolean;
  items: TItem[];
  nextCursor?: string;
  page?: number;
  total?: number;
};

type AsyncArgs<T> = T extends (...args: infer Args) => Promise<unknown> ? Args : never;

type AsyncOut<T> = T extends (...args: never[]) => Promise<infer Out> ? Out : never;

type DocsOf<TMap extends Record<string, SyncDocEntry>> = {
  [K in keyof TMap]: TMap[K] extends { read: SyncLeaf<[], infer TOut>; write: SyncLeaf<infer TWriteArgs> }
    ? SyncDoc<TOut, (...args: TWriteArgs) => Promise<TOut>>
    : TMap[K] extends { read: SyncLeaf<[], infer TOut> }
      ? SyncDoc<TOut>
      : never;
};

type IdItem = { id: string };

type ListEntry = {
  create?: SyncLeaf<never[], IdItem>;
  limit?: number;
  list: SyncLeaf<never[], SyncListPage<IdItem>>;
  patch?: SyncLeaf<never[], IdItem>;
  read?: SyncLeaf<never[]>;
  remove?: SyncLeaf<never[], IdItem>;
  update?: SyncLeaf<never[], IdItem>;
};

type ListItemOf<TList> =
  TList extends SyncLeaf<unknown[], { items: (infer TItem extends IdItem)[] }>
    ? TItem
    : TList extends (...args: never[]) => Promise<{ items: (infer TItem extends IdItem)[] }>
      ? TItem
      : IdItem;

type ListLoadInput<TList> = AsyncArgs<TList> extends [infer Input, ...unknown[]] ? Input : undefined;

type ListMethodsOf<T extends ListEntry> = {
  append: () => Promise<void>;
  load: (input?: ListLoadInput<T[`list`]>) => Promise<boolean>;
} & (T extends { create: infer Create }
  ? { create: (...args: AsyncArgs<Create>) => Promise<ListItemOf<T[`list`]>> }
  : object) &
  (T extends { patch: infer Patch }
    ? { patch: (...args: AsyncArgs<Patch>) => Promise<ListItemOf<T[`list`]>> }
    : object) &
  (T extends { read: infer Read } ? { read: (...args: AsyncArgs<Read>) => Promise<AsyncOut<Read>> } : object) &
  (T extends { remove: infer Remove } ? { remove: (...args: AsyncArgs<Remove>) => Promise<IdItem> } : object) &
  (T extends { update: infer Update }
    ? { update: (...args: AsyncArgs<Update>) => Promise<IdItem & Partial<ListItemOf<T[`list`]>>> }
    : object);

type Mirror = {
  <TOut>(proc: SyncLeaf<[], TOut>): SyncDoc<TOut>;
  <TOut, TWriteArgs extends unknown[]>(
    proc: SyncLeaf<[], TOut>,
    config: { write: SyncLeaf<TWriteArgs, TOut> },
  ): SyncDoc<TOut, (...args: TWriteArgs) => Promise<TOut>>;
};

type ResourcesConfig<
  TDocs extends Record<string, SyncDocEntry> = Record<string, never>,
  TLists extends Record<string, ListEntry> = Record<string, never>,
> = { docs?: TDocs; lists?: TLists };

type SyncScopeConfig = {
  api: { close: () => void; onReconnect?: (listener: () => void) => () => void; open: () => void };
};

const asPage = <TItem extends IdItem>(page: SyncListPage<TItem>): SyncListPage<TItem> => ({
  ...page,
  cursor: page.nextCursor ?? page.cursor,
  hasMore: page.nextCursor !== undefined || page.hasMore === true,
});

const scope = ({ api }: SyncScopeConfig) => {
  let opened = false;
  let generation = 0;
  const $revision = Store(0);
  const lives: { attach: () => () => void }[] = [];
  const seeds: (() => Promise<unknown>)[] = [];
  const clears: (() => void)[] = [];
  let unsubscribes: (() => void)[] = [];

  const track = <TArgs extends unknown[], TOut>(
    proc: SyncLeaf<TArgs, TOut>,
    apply: (data: TOut) => void,
  ): ((...args: TArgs) => Promise<TOut>) => {
    const live = {
      attach: () =>
        proc.on(data => {
          if (opened) {
            apply(data);
          }
        }),
    };
    lives.push(live);
    if (opened) {
      unsubscribes.push(live.attach());
    }

    return async (...args: TArgs) => {
      const gen = generation;
      const result = await proc(...args);
      if (opened && gen === generation) {
        apply(result);
      }

      return result;
    };
  };

  const mirror = (<TOut, TWriteArgs extends unknown[]>(
    proc: SyncLeaf<[], TOut>,
    config: { write?: SyncLeaf<TWriteArgs, TOut> } = {},
  ) => {
    const $doc = Store<TOut | undefined>(undefined);

    const apply = (data: TOut) => {
      $doc.set(data);
    };

    const load = track(proc, apply);
    clears.push(() => {
      $doc.set(undefined);
    });

    const write = config.write === undefined ? undefined : track(config.write, apply);
    seeds.push(load);

    const clear = () => {
      $doc.set(undefined);
    };

    return write === undefined ? Object.assign($doc, { clear, load }) : Object.assign($doc, { clear, load, write });
  }) as Mirror;

  const docs = <const TMap extends Record<string, SyncDocEntry>>(map: TMap): DocsOf<TMap> => {
    const result = {} as DocsOf<TMap>;
    const keys = _.keys(map);

    for (const key of keys) {
      const entry = map[key];
      if (entry !== undefined) {
        result[key] = (
          entry.write === undefined ? mirror(entry.read) : mirror(entry.read, { write: entry.write })
        ) as DocsOf<TMap>[typeof key];
      }
    }

    return result;
  };

  const list = <TItem extends IdItem>(entry: {
    create?: SyncLeaf<never[], TItem>;
    limit?: number;
    list: SyncLeaf<never[], SyncListPage<TItem>>;
    patch?: SyncLeaf<never[], TItem>;
    read?: SyncLeaf<never[]>;
    remove?: SyncLeaf<never[], IdItem>;
    update?: SyncLeaf<never[], IdItem & Partial<TItem>>;
  }) => {
    const $page = Store<SyncListPage<TItem> | undefined>(undefined);
    const $item = Store<TItem | undefined>(undefined);
    clears.push(() => {
      $page.set(undefined);
      $item.set(undefined);
    });

    const touchItem = (row: IdItem & Partial<TItem>) => {
      const current = $item();
      if (current?.id === row.id) {
        $item.set({ ...current, ...row });
      }
    };

    const upsert = (item: TItem) => {
      const page = $page() ?? { items: [] as TItem[] };
      const { items } = page;
      $page.set(
        asPage({
          ...page,
          items: items.some(row => row.id === item.id)
            ? items.map(row => (row.id === item.id ? item : row))
            : [item, ...items],
        }),
      );
      touchItem(item);
    };

    const drop = ({ id }: IdItem) => {
      const page = $page();
      if (page !== undefined) {
        $page.set(
          asPage({
            ...page,
            items: page.items.filter(row => row.id !== id),
            ...(page.total === undefined ? {} : { total: Math.max(0, page.total - 1) }),
          }),
        );
      }
      if ($item()?.id === id) {
        $item.set(undefined);
      }
    };

    const merge = (row: IdItem & Partial<TItem>) => {
      const page = $page();
      if (page !== undefined) {
        $page.set(
          asPage({ ...page, items: page.items.map(item => (item.id === row.id ? { ...item, ...row } : item)) }),
        );
      }
      touchItem(row);
    };

    const callList = entry.list as unknown as (input?: unknown) => Promise<SyncListPage<TItem>>;
    const unset = Symbol(`unset`);
    let lastInput: unknown = unset;
    let loadSeq = 0;
    let readSeq = 0;

    const load = async (input?: unknown) => {
      lastInput = input;
      if (!opened) {
        return false;
      }
      const gen = generation;
      loadSeq += 1;
      const seq = loadSeq;
      const requested = input;
      const args = entry.limit === undefined ? input : { ...(input as object | undefined), limit: entry.limit };
      const page = asPage(await callList(args));
      if (gen === generation && lastInput === requested && seq === loadSeq) {
        $page.set(page);

        return true;
      }

      return false;
    };

    const append = async () => {
      if (!opened) {
        return;
      }
      const page = $page();
      if (page === undefined || entry.limit === undefined) {
        return;
      }

      const cursor = page.nextCursor ?? page.cursor;
      if (cursor === undefined || page.hasMore !== true) {
        return;
      }

      const gen = generation;
      const next = asPage(await callList({ cursor, limit: entry.limit }));
      if (gen !== generation) {
        return;
      }
      const current = $page();
      if (current === undefined) {
        return;
      }
      const currentCursor = current.nextCursor ?? current.cursor;
      if (currentCursor !== cursor) {
        return;
      }
      $page.set(asPage({ ...next, items: [...current.items, ...next.items] }));
    };

    seeds.push(async () => {
      if (lastInput === unset) {
        return;
      }
      await load(lastInput);
    });

    const methods: SyncListMut & { append: typeof append; load: typeof load } = { append, load };
    const upsertOrDrop = (data: IdItem) => (_.keys(data).length === 1 ? drop(data) : upsert(data as TItem));

    if (entry.create !== undefined) {
      methods.create = track(entry.create as SyncLeaf<[unknown], TItem>, upsertOrDrop);
    }
    if (entry.patch !== undefined) {
      methods.patch = track(entry.patch as SyncLeaf<[unknown], TItem>, upsert);
    }
    if (entry.update !== undefined) {
      methods.update = track(entry.update as SyncLeaf<[unknown], IdItem & Partial<TItem>>, merge);
    }
    if (entry.remove !== undefined) {
      methods.remove = track(entry.remove as SyncLeaf<[unknown], IdItem>, drop);
    }
    if (entry.read !== undefined) {
      const raw = entry.read as SyncLeaf<[unknown], TItem | undefined>;
      methods.read = async (input: unknown) => {
        if (!opened) {
          return undefined;
        }
        const gen = generation;
        readSeq += 1;
        const seq = readSeq;
        const result = await raw(input);
        if (gen === generation && seq === readSeq) {
          $item.set(result);
        }

        return result;
      };
    }

    return Object.assign($page, methods, { $item });
  };

  const lists = <const TMap extends Record<string, ListEntry>>(map: TMap): ListsOf<TMap> => {
    const result = {} as ListsOf<TMap>;
    const keys = _.keys(map);

    for (const key of keys) {
      const entry = map[key];
      if (entry !== undefined) {
        result[key] = list(entry) as unknown as ListsOf<TMap>[typeof key];
      }
    }

    return result;
  };

  const resources = <const TDocs extends Record<string, SyncDocEntry>, const TLists extends Record<string, ListEntry>>(
    config: ResourcesConfig<TDocs, TLists>,
  ): DocsOf<TDocs> & ListsOf<TLists> =>
    ({
      ...(config.docs === undefined ? {} : docs(config.docs)),
      ...(config.lists === undefined ? {} : lists(config.lists)),
    }) as DocsOf<TDocs> & ListsOf<TLists>;

  let unsubscribeReconnect: (() => void) | undefined;
  let gate: Promise<void> = Promise.resolve();
  let openEpoch = 0;

  const reseed = async () => {
    if (!opened) {
      return;
    }
    await Promise.allSettled(seeds.map(async seed => seed()));
  };

  const reset = () => {
    generation += 1;
    opened = false;
    unsubscribeReconnect?.();
    unsubscribeReconnect = undefined;
    for (const unsubscribe of unsubscribes) {
      unsubscribe();
    }
    unsubscribes = [];
    for (const clear of clears) {
      clear();
    }
  };

  const close = () => {
    openEpoch += 1;
    reset();
    api.close();
  };

  const runOpen = () => {
    if (opened) {
      close();
    } else {
      reset();
    }
    api.open();
    opened = true;
    unsubscribes = lives.map(live => live.attach());
    unsubscribeReconnect = api.onReconnect?.(() => {
      generation += 1;
      void reseed();
    });
    $revision.set($revision() + 1);
    void reseed();
  };

  const open = async () => {
    const previous = gate;
    const { promise, resolve } = Promise.withResolvers<void>();
    gate = promise;
    const epoch = openEpoch;
    await previous;
    try {
      if (epoch === openEpoch) {
        runOpen();
      }
    } finally {
      resolve();
    }
  };

  const bind = ({ onOpen, session }: { onOpen?: () => void; session: StoreType<boolean> }) => {
    const adopt = async () => {
      onOpen?.();
      await open();
    };

    session.subscribe(signedIn => {
      if (!signedIn) {
        close();
      }
    });

    return adopt;
  };

  return { $revision, bind, close, docs, list, lists, mirror, open, resources, track };
};

export type AsDocs<T extends Record<string, unknown>> = { [K in keyof T]: AsDoc<T[K]> };

export type AsLists<T extends Record<string, unknown>> = { [K in keyof T]: AsList<T[K]> };

type AsDoc<T> = T extends { read: SyncLeaf<[]> }
  ? T
  : T extends { get: infer TGet; set: infer TSet }
    ? { read: TGet; write: TSet }
    : T extends { get: infer TGet }
      ? { read: TGet }
      : T extends (...args: never[]) => Promise<unknown>
        ? { read: T }
        : never;

type AsList<T> = T extends { of: infer TSource extends ListSource }
  ? ListWired<TSource, Omit<Extract<T, ListRef>, `of`>>
  : T extends ListSource
    ? ListWired<T, Pick<T, Extract<keyof T, keyof ListOptions>>>
    : never;

type DocSource = SyncLeaf<[]> | { get: SyncLeaf<[]>; set?: SyncLeaf<never[]> };

type DocWired<T extends DocSource> = T extends {
  get: infer TGet extends SyncLeaf<[]>;
  set: infer TSet extends SyncLeaf<never[]>;
}
  ? { read: TGet; write: TSet }
  : T extends { get: infer TGet extends SyncLeaf<[]> }
    ? { read: TGet }
    : T extends SyncLeaf<[]>
      ? { read: T }
      : never;

type ListOptions = { limit?: number };

type ListRef = ListOptions & { of: ListSource };

type ListSource = {
  create?: SyncLeaf<never[]>;
  list: SyncLeaf<never[]>;
  patch?: SyncLeaf<never[]>;
  read?: SyncLeaf<never[]>;
  remove?: SyncLeaf<never[]>;
  update?: SyncLeaf<never[]>;
};

type ListWired<T extends ListSource, TOptions extends ListOptions> = (T extends { create: infer Create }
  ? { create: Create }
  : object) &
  (T extends { patch: infer Patch } ? { patch: Patch } : object) &
  (T extends { read: infer Read } ? { read: Read } : object) &
  (T extends { remove: infer Remove } ? { remove: Remove } : object) &
  (T extends { update: infer Update } ? { update: Update } : object) &
  TOptions & { list: T[`list`] };

const doc = <const T extends DocSource>(source: T): DocWired<T> =>
  (_.isFunction(source)
    ? { read: source }
    : source.set === undefined
      ? { read: source.get }
      : { read: source.get, write: source.set }) as DocWired<T>;

const list = <const T extends ListSource, const TOptions extends ListOptions = object>(
  source: T,
  options?: TOptions,
): ListWired<T, TOptions> => {
  const { create, list: listProc, patch, read, remove, update } = source;
  const limit = options?.limit;

  return {
    list: listProc,
    ...(limit === undefined ? {} : { limit }),
    ...(create === undefined ? {} : { create }),
    ...(patch === undefined ? {} : { patch }),
    ...(update === undefined ? {} : { update }),
    ...(read === undefined ? {} : { read }),
    ...(remove === undefined ? {} : { remove }),
  } as ListWired<T, TOptions>;
};

export const Sync = { doc, list, scope };
