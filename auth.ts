/* eslint-disable unicorn/filename-case */
import { BetterAuth } from "@snappy/app-server";
import { Config } from "@snappy/config";
import { Db } from "@snappy/db";

const db = Db(Config.dbUrl());

export const auth = BetterAuth({ db });
