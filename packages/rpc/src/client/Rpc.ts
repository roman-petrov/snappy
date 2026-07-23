/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import { _, Store, type Store as StoreType } from "@snappy/core";

import type { Endpoint } from "../Endpoint";
import type { RpcApiTree } from "../Procedure";
import type { RpcClient } from "../Types";

import { Client } from "../Client";
import { type DocsFromSync, type ListsFromSync, SyncManifest } from "../SyncManifest";
import { Sync, type SyncResourcesOf } from "./Sync";

type AuthCfg<TApi = unknown> = {
  signedIn: (api: TApi) => boolean | Promise<boolean>;
  signIn: (...args: never[]) => Promise<{ status: string }>;
  signOut: () => unknown;
};

type AuthMethods<TAuth extends AuthCfg<never>> = Omit<TAuth, `signedIn` | `signIn` | `signOut`> & {
  signIn: TAuth[`signIn`];
  signOut: () => Promise<void>;
  sync: () => Promise<void>;
};

type AuthStore<TAuth extends object> = StoreType<boolean> & TAuth;

type ConnectSync<TApi extends RpcApiTree, TOwn extends object = object, TAuth extends object = object> = Wired<
  TApi,
  TOwn & { auth: AuthStore<TAuth> }
>;

type RpcConfig<TAuth extends AuthCfg<never>> = { auth: TAuth; onOpen?: () => void };

type Wired<TApi extends RpcApiTree, TOwn extends object = object> = Omit<RpcClient<TApi>, keyof TOwn> & TOwn;

type WiredOf<TApi extends RpcApiTree, TSync extends SyncManifest> = SyncResourcesOf<{
  docs: DocsFromSync<RpcClient<TApi>, TSync>;
  lists: ListsFromSync<RpcClient<TApi>, TSync>;
}>;

export const Rpc = async <
  TApi extends RpcApiTree,
  const TSync extends SyncManifest,
  const TAuth extends AuthCfg<RpcClient<TApi>>,
>(
  contract: Endpoint<TApi, TSync>,
  config: RpcConfig<TAuth>,
): Promise<ConnectSync<TApi, WiredOf<TApi, TSync>, AuthMethods<TAuth>>> => {
  type Own = WiredOf<TApi, TSync>;

  type Api = Wired<TApi, Own>;

  type Methods = AuthMethods<TAuth>;

  const client = Client<TApi>({ path: contract.path });
  const scope = Sync.scope({ api: client });
  const wired = scope.resources(SyncManifest.resolve(client, contract.sync) as Parameters<typeof scope.resources>[0]);
  const session: { auth?: AuthStore<Methods> } = {};

  const api = new Proxy(client, {
    get: (target, prop) =>
      prop === `auth`
        ? session.auth
        : prop === `then`
          ? undefined
          : _.isString(prop) && Object.hasOwn(wired, prop)
            ? wired[prop]
            : target[prop as keyof typeof target],
  }) as unknown as Api;

  const { signedIn: readSession, signIn: authSignIn, signOut: authSignOut, ...authExtra } = config.auth;
  const signedIn = Store(await readSession(client));
  const adopt = scope.bind({ onOpen: config.onOpen, session: signedIn });
  const auth = { epoch: 0 };
  if (signedIn()) {
    await adopt().then(undefined, () => {
      client.close();
      signedIn.set(false);
    });
  } else {
    client.close();
  }

  const signIn = (async (...args: never[]) => {
    const result = await authSignIn(...args);
    if (result.status === `ok`) {
      if (signedIn()) {
        return result;
      }
      const started = auth.epoch;
      signedIn.set(true);
      const done = adopt();
      await done.then(undefined, () => {
        signedIn.set(false);
        client.close();

        return false;
      });
      await done;
      if (!signedIn() || started !== auth.epoch) {
        signedIn.set(false);
        client.close();

        return result;
      }
    }

    return result;
  }) as TAuth[`signIn`];

  const signOut = async () => {
    auth.epoch += 1;
    signedIn.set(false);
    await authSignOut();
  };

  const sync = async () => {
    if (signedIn()) {
      return;
    }
    const started = auth.epoch;
    client.open();
    const active = await Promise.resolve(readSession(client)).catch(() => false);
    if (!active || started !== auth.epoch) {
      client.close();

      return;
    }
    signedIn.set(true);
    let adopted = true;
    await adopt().then(undefined, () => {
      adopted = false;
    });
    if (!adopted || !signedIn() || started !== auth.epoch) {
      signedIn.set(false);
      client.close();
    }
  };

  session.auth = Object.assign(signedIn, { ...authExtra, signIn, signOut, sync });

  return api as unknown as ConnectSync<TApi, Own, Methods>;
};
