/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable unicorn/no-array-reduce */
import { _ } from "@snappy/core";

import { type AsDocs, type AsLists, Sync } from "./Sync";

export type DocsFromSync<TApi, TSync extends SyncManifest> = AsDocs<{
  [K in keyof NonNullable<TSync[`docs`]> & string]: PathValue<TApi, K>;
}>;

export type ListsFromSync<TApi, TSync extends SyncManifest> = AsLists<{
  [K in keyof NonNullable<TSync[`lists`]> & string]: ListMeta<NonNullable<TSync[`lists`]>[K]> & {
    of: PathValue<TApi, K>;
  };
}>;

export type SyncDocKind = `read` | `readWrite`;

export type SyncListRef = number | true;

export type SyncManifest = {
  docs?: Partial<Record<string, SyncDocKind>>;
  lists?: Partial<Record<string, SyncListRef>>;
};

type ListMeta<TRef> = TRef extends number ? { limit: TRef } : object;

type PathValue<T, TPath extends string> = TPath extends `${infer Head}.${infer Rest}`
  ? Head extends keyof T
    ? PathValue<T[Head], Rest>
    : never
  : TPath extends keyof T
    ? T[TPath]
    : never;

const lookup = (root: unknown, path: string): unknown =>
  path.split(`.`).reduce<unknown>((node, key) => (node as null | Record<string, unknown> | undefined)?.[key], root);

const resolve = <TApi extends object, TSync extends SyncManifest>(
  api: TApi,
  sync: TSync,
): { docs: DocsFromSync<TApi, TSync>; lists: ListsFromSync<TApi, TSync> } => {
  const docs = _.fromEntries(
    _.entries(sync.docs ?? {}).map(([name, entry]) => {
      const value =
        entry === `readWrite`
          ? { get: lookup(api, `${name}.get`), set: lookup(api, `${name}.set`) }
          : lookup(api, name);

      return [name, Sync.doc(value as Parameters<typeof Sync.doc>[0])] as const;
    }),
  ) as DocsFromSync<TApi, TSync>;

  const lists = _.fromEntries(
    _.entries(sync.lists ?? {}).map(([name, entry]) => [
      name,
      Sync.list(lookup(api, name) as Parameters<typeof Sync.list>[0], _.isNumber(entry) ? { limit: entry } : undefined),
    ]),
  ) as ListsFromSync<TApi, TSync>;

  return { docs, lists };
};

export const SyncManifest = { resolve };
