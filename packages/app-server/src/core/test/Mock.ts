/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { Db, DbUser } from "@snappy/db";

import { vi } from "vitest";

const balanceMethods = () => ({ credit: vi.fn(), creditTopUp: vi.fn(), debit: vi.fn(), read: vi.fn(), set: vi.fn() });
const feedMethods = () => ({ create: vi.fn(), image: vi.fn(), list: vi.fn(), patch: vi.fn(), remove: vi.fn() });
const paymentLogCreate = () => vi.fn();
const userSettingsMethods = () => ({ read: vi.fn(), update: vi.fn() });

const withLive = <T extends object>(factory: () => T) =>
  Object.assign(vi.fn(factory), { live: vi.fn(() => () => undefined) });

const createDbUser = (id = `test-user`): DbUser => ({
  balance: balanceMethods(),
  feed: feedMethods(),
  id,
  paymentLog: { create: paymentLogCreate() },
  settings: userSettingsMethods(),
});

const createDb = (): Db => {
  const user = vi.fn(createDbUser);

  return {
    auth: {} as Db[`auth`],
    balance: withLive(balanceMethods),
    feed: withLive(feedMethods),
    paymentLog: { create: vi.fn(), createOnce: vi.fn(), pendingAmount: vi.fn(), succeeded: vi.fn() },
    settings: withLive(userSettingsMethods),
    user,
    users: { list: vi.fn(), read: vi.fn(), remove: vi.fn() },
  };
};

export const Mock = { createDb, createDbUser };
