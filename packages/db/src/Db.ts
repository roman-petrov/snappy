import {
  DbCore,
  DbCoreAdmin,
  type DbCoreAuth,
  type DbCoreBalance,
  type DbCoreBalanceHistoryMeta,
  type DbCoreFeedArtifact,
  type DbCoreFeedEvent,
  type DbCorePaymentLogEntry,
  type DbCoreSettings,
  type DbCoreUser,
} from "@snappy/db-core";

export const Db = DbCore;

export type Db = ReturnType<typeof Db>;

export const AdminDb = DbCoreAdmin;

export type AdminDb = ReturnType<typeof AdminDb>;

export type DbAuth = DbCoreAuth;

export type DbBalance = DbCoreBalance;

export type DbBalanceHistoryMeta = DbCoreBalanceHistoryMeta;

export type DbFeedArtifact = DbCoreFeedArtifact;

export type DbFeedEvent = DbCoreFeedEvent;

export type DbPaymentLogEntry = DbCorePaymentLogEntry;

export type DbSettings = DbCoreSettings;

export type DbUser = DbCoreUser;
