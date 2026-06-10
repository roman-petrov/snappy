import {
  DbCore,
  type DbCoreAuth,
  type DbCoreBalanceHistoryMeta,
  type DbCoreFeedArtifact,
  type DbCorePaymentLogEntry,
  type DbCoreSettingsPatch,
  type DbCoreUser,
} from "@snappy/db-core";

export const Db = DbCore;

export type Db = DbCore;

export type DbAuth = DbCoreAuth;

export type DbBalanceHistoryMeta = DbCoreBalanceHistoryMeta;

export type DbFeedArtifact = DbCoreFeedArtifact;

export type DbPaymentLogEntry = DbCorePaymentLogEntry;

export type DbSettingsPatch = DbCoreSettingsPatch;

export type DbUser = DbCoreUser;
