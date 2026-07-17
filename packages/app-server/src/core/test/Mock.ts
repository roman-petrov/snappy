/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { Db, DbUser } from "@snappy/db";

import { vi } from "vitest";

const balanceMethods = () => ({ credit: vi.fn(), creditTopUp: vi.fn(), debit: vi.fn(), read: vi.fn(), set: vi.fn() });
const paymentLogCreate = () => vi.fn();
const userSettingsMethods = () => ({ find: vi.fn(), update: vi.fn() });

const createDbUser = (id = `test-user`): DbUser => ({
  balance: balanceMethods(),
  feed: { create: vi.fn(), image: vi.fn(), list: vi.fn(), patch: vi.fn(), remove: vi.fn() },
  id,
  paymentLog: { create: paymentLogCreate() },
  settings: userSettingsMethods(),
});

const createDb = (): ReturnType<typeof Db> => {
  const user = vi.fn(createDbUser);

  return {
    auth: {} as ReturnType<typeof Db>[`auth`],
    paymentLog: { create: vi.fn(), createOnce: vi.fn(), pendingAmount: vi.fn(), succeeded: vi.fn() },
    user,
    users: { list: vi.fn(), read: vi.fn(), remove: vi.fn() },
  };
};

export const Mock = { createDb, createDbUser };
