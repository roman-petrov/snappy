/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { Db } from "@snappy/db";

import { vi } from "vitest";

const balanceMethods = () => ({ credit: vi.fn(), debit: vi.fn(), read: vi.fn() });
const paymentLogMethods = () => ({ create: vi.fn(), hasSucceededPayment: vi.fn() });
const snappySettingsMethods = () => ({ findByUserId: vi.fn(), updateLlmModels: vi.fn() });

const userMethods = () => ({
  clearResetAndSetPassword: vi.fn(),
  createWithEmailPassword: vi.fn(),
  findByEmail: vi.fn(),
  findByResetToken: vi.fn(),
  setResetToken: vi.fn(),
});

const createDb = (): Db =>
  ({
    balance: balanceMethods(),
    paymentLog: paymentLogMethods(),
    snappySettings: snappySettingsMethods(),
    user: userMethods(),
  }) as unknown as Db;

export const Mock = { createDb };
