import { PrismaPg } from "@prisma/adapter-pg";

import { DbBalance } from "./DbBalance";
import { DbPaymentLog } from "./DbPaymentLog";
import { DbUser } from "./DbUser";
import { DbUserSettings } from "./DbUserSettings";
import { PrismaClient } from "./generated/client";

export const Db = (connectionString: string) => {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  const balance = DbBalance(prisma);
  const user = DbUser(prisma);
  const paymentLog = DbPaymentLog(prisma);
  const userSettings = DbUserSettings(prisma);

  return { balance, paymentLog, user, userSettings };
};

export type Db = ReturnType<typeof Db>;
