/* eslint-disable unicorn/filename-case */
import { Config } from "@snappy/config";
import { Db } from "@snappy/db";
import { BetterAuth } from "@snappy/server-app";

export const auth = BetterAuth({ prisma: Db(Config.dbUrl).prisma });
