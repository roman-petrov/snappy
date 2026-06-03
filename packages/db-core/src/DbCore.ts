import type { Prisma } from "./generated/client";

import { DbCoreAuthAdapter } from "./DbCoreAuth";
import { DbCoreClient } from "./DbCoreClient";
import { DbCorePaymentLog, type DbCorePaymentLogRow } from "./DbCorePaymentLog";
import { DbCoreUserBalance } from "./DbCoreUserBalance";
import { DbCoreUsers } from "./DbCoreUsers";
import { DbCoreUserSettings } from "./DbCoreUserSettings";

export type { DbCoreSettingsPatch } from "./DbCoreUserSettings";

export type DbCoreAuth = ReturnType<typeof DbCoreAuthAdapter>;

export type DbCoreBalanceHistoryMeta = Prisma.InputJsonValue;

export type DbCorePaymentLogEntry = Omit<DbCorePaymentLogRow, `userId`>;

export const DbCore = (connectionString: string) => {
  const prisma = DbCoreClient(connectionString);
  const paymentLog = DbCorePaymentLog(prisma);
  const users = DbCoreUsers(prisma);
  const auth = DbCoreAuthAdapter(prisma);

  const user = (id: string) => ({
    balance: DbCoreUserBalance(prisma, id),
    id,
    paymentLog: { create: async (entry: DbCorePaymentLogEntry) => paymentLog.create({ ...entry, userId: id }) },
    settings: DbCoreUserSettings(prisma, id),
  });

  return { auth, paymentLog, user, users };
};

export type DbCore = ReturnType<typeof DbCore>;

export type DbCoreUser = ReturnType<DbCore[`user`]>;
