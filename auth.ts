/* eslint-disable unicorn/filename-case */
import { BetterAuth } from "@snappy/app-server";
import { Config } from "@snappy/config";
import { Db } from "@snappy/db";

export const auth = BetterAuth({ auth: Db(Config.dbUrl()).auth });
