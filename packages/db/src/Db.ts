import { PrismaPg } from "@prisma/adapter-pg";

import { DbBalance } from "./DbBalance";
import { DbPaymentLog } from "./DbPaymentLog";
import { DbSnappySettings } from "./DbSnappySettings";
import { DbUser } from "./DbUser";
import { PrismaClient } from "./generated/client";

export const Db = (connectionString: string) => {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  const balance = DbBalance(prisma);
  const user = DbUser(prisma);
  const paymentLog = DbPaymentLog(prisma);
  const snappySettings = DbSnappySettings(prisma);

  return { balance, paymentLog, snappySettings, user };
};

export type Db = ReturnType<typeof Db>;
