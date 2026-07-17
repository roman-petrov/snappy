/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { RpcApiTree } from "./Procedure";
import type { SyncManifest } from "./SyncManifest";

export type ApiOf<TContract extends { modules?: object }> = RpcApi<NonNullable<TContract[`modules`]>>;

export type Contract<TModules extends object = object, TSync extends SyncManifest = SyncManifest> = Endpoint<
  RpcApi<TModules> extends RpcApiTree ? RpcApi<TModules> : RpcApiTree,
  TSync
> & { modules?: TModules };

export type Endpoint<TApi extends RpcApiTree = RpcApiTree, TSync extends SyncManifest = SyncManifest> = {
  api?: TApi;
  path: string;
  sync: TSync;
};

export type RpcApi<T> = T extends { readonly rpc: infer TRpc }
  ? TRpc
  : T extends object
    ? { [K in keyof T]: RpcApi<T[K]> }
    : T;

type Join<TPrefix extends string, TKey extends string> = TPrefix extends `` ? TKey : `${TPrefix}.${TKey}`;

type Paths<T, TPrefix extends string = ``> = {
  [TKey in keyof T & string]: T[TKey] extends { rpc: unknown }
    ? Join<TPrefix, TKey>
    : T[TKey] extends object
      ? Paths<T[TKey], Join<TPrefix, TKey>>
      : never;
}[keyof T & string];

type SyncFor<TModules> = {
  docs?: Partial<Record<Paths<TModules>, `read` | `readWrite`>>;
  lists?: Partial<Record<Paths<TModules>, number | true>>;
};

const define =
  <TModules extends object>() =>
  <const TSync extends SyncFor<TModules> = Record<string, never>>(config: {
    path: string;
    sync?: TSync;
  }): Contract<TModules, TSync> => ({ path: config.path, sync: config.sync ?? ({} as TSync) });

export const Endpoint = { define };
