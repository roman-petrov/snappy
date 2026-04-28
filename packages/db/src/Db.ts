import { PrismaPg } from "@prisma/adapter-pg";

import { DbPaymentLog } from "./DbPaymentLog";
import { DbUserBalance } from "./DbUserBalance";
import { DbUserSettings } from "./DbUserSettings";
import { PrismaClient } from "./generated/client";

export const Db = (connectionString: string) => {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  const paymentLog = DbPaymentLog(prisma);
  const userBalance = DbUserBalance(prisma);
  const userSettings = DbUserSettings(prisma);

  return { paymentLog, prisma, userBalance, userSettings };
};

export type Db = ReturnType<typeof Db>;
