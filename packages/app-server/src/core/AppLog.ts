import { _ } from "@snappy/core";
import { Log } from "@snappy/log";

type Identity = { email?: string; userId?: string };

export const AppLog = (identity: Identity = {}) =>
  Log.withFields(_.filterEntries(identity, (_key, value) => value !== undefined));

export type AppLog = ReturnType<typeof AppLog>;
