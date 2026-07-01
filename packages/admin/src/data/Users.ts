/* eslint-disable functional/no-expression-statements */
import type { TrpcClient, TrpcOutputs } from "@snappy/admin-server-api";

import { Store } from "@snappy/core";
import { DataHook } from "@snappy/store";

export type User = TrpcOutputs[`users`][`read`];

type UsersList = TrpcOutputs[`users`][`list`];

type UsersListInput = { page: number; pageSize: number };

type UsersUpdateInput = Parameters<TrpcClient[`users`][`update`][`mutate`]>[0];

export const Users = (trpc: TrpcClient) => {
  const $list = Store<undefined | UsersList>(undefined);

  const patchItem = (id: string, patch: Partial<UsersList[`items`][number]>) => {
    const list = $list();

    if (list === undefined) {
      return;
    }

    $list.set({ ...list, items: list.items.map(item => (item.id === id ? { ...item, ...patch } : item)) });
  };

  const clear = () => $list.set(undefined);
  const fetch = async (id: string) => trpc.users.read.query({ id });
  const load = async (input: UsersListInput) => $list.set(await trpc.users.list.query(input));

  const remove = async (id: string) => {
    await trpc.users.delete.mutate({ id });

    const list = $list();

    if (list !== undefined) {
      $list.set({ ...list, items: list.items.filter(item => item.id !== id), total: Math.max(0, list.total - 1) });
    }
  };

  const update = async (input: UsersUpdateInput) => {
    await trpc.users.update.mutate(input);
    patchItem(input.id, { balanceRub: input.balanceRub });
  };

  const users = DataHook($list, value => ({ fetch, load, remove, update, users: value }));

  return { clear, users };
};
