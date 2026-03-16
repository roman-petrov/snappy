/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { Db } from "@snappy/db";

import { vi } from "vitest";

const userMethods = () => ({
  clearResetAndSetPassword: vi.fn(),
  createWithEmailPassword: vi.fn(),
  findByEmail: vi.fn(),
  findByResetToken: vi.fn(),
  setResetToken: vi.fn(),
  upsertByTelegramId: vi.fn(),
});

const subscriptionMethods = () => ({
  deleteByUserId: vi.fn(),
  findByUserId: vi.fn(),
  findDueForRenewal: vi.fn(),
  setAutoRenew: vi.fn(),
  updatePremiumDates: vi.fn(),
  upsert: vi.fn(),
});

const paymentLogMethods = () => ({ create: vi.fn(), hasSucceededPayment: vi.fn() });

const snappySettingsMethods = () => ({
  findByUserId: vi.fn(),
  resetCounter: vi.fn(),
  upsert: vi.fn(),
  upsertWithReset: vi.fn(),
});

const createDb = (): Db =>
  ({
    paymentLog: paymentLogMethods(),
    snappySettings: snappySettingsMethods(),
    subscription: subscriptionMethods(),
    user: userMethods(),
  }) as unknown as Db;

export const Mock = { createDb };
