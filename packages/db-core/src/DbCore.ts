import { S3Core } from "@snappy/s3-core";

import type { Prisma } from "./generated/client";

import { DbCoreAuthAdapter } from "./DbCoreAuth";
import { DbCoreClient } from "./DbCoreClient";
import { DbCoreFeed } from "./DbCoreFeed";
import { DbCorePaymentLog, type DbCorePaymentLogRow } from "./DbCorePaymentLog";
import { DbCoreUserBalance } from "./DbCoreUserBalance";
import { DbCoreUsers } from "./DbCoreUsers";
import { DbCoreUserSettings } from "./DbCoreUserSettings";

export type { DbCoreFeedArtifact, DbCoreFeedEvent, DbCoreFeedPatch } from "./DbCoreFeed";

export type { DbCoreBalance } from "./DbCoreUserBalance";

export type { DbCoreSettings } from "./DbCoreUserSettings";

export type DbCoreAuth = ReturnType<typeof DbCoreAuthAdapter>;

export type DbCoreBalanceHistoryMeta = Prisma.InputJsonValue;

export type DbCorePaymentLogEntry = Omit<DbCorePaymentLogRow, `userId`>;

export const DbCore = (connectionString: string) => {
  const prisma = DbCoreClient(connectionString);
  const paymentLog = DbCorePaymentLog(prisma);
  const users = DbCoreUsers(prisma);
  const auth = DbCoreAuthAdapter(prisma);

  const user = (id: string) => {
    const storage = S3Core.user(id);
    const balance = DbCoreUserBalance(prisma, id);
    const feed = DbCoreFeed(prisma, storage);
    const settings = DbCoreUserSettings(prisma, id);
    const log = { create: async (entry: DbCorePaymentLogEntry) => paymentLog.create({ ...entry, userId: id }) };

    return { balance, feed, id, paymentLog: log, settings };
  };

  return { auth, balance: DbCoreUserBalance, feed: DbCoreFeed, paymentLog, settings: DbCoreUserSettings, user, users };
};

export type DbCore = ReturnType<typeof DbCore>;

export type DbCoreUser = ReturnType<DbCore[`user`]>;
