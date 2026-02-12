import type { Database } from "@snappy/db";
import type { Snappy } from "@snappy/snappy";
import type { YooKassa } from "@snappy/yoo-kassa";

export type AppContext = {
  db: Database;
  freeRequestLimit: number;
  jwtSecret: string;
  premiumPrice: number;
  snappy: Snappy;
  yooKassa: YooKassa;
};
