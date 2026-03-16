import { PrismaPg } from "@prisma/adapter-pg";

import { DbPaymentLog } from "./DbPaymentLog";
import { DbSnappySettings } from "./DbSnappySettings";
import { DbSubscription } from "./DbSubscription";
import { DbUser } from "./DbUser";
import { PrismaClient } from "./generated/client";

export const Db = (connectionString: string) => {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  const user = DbUser(prisma);
  const subscription = DbSubscription(prisma);
  const paymentLog = DbPaymentLog(prisma);
  const snappySettings = DbSnappySettings(prisma);

  return { paymentLog, snappySettings, subscription, user };
};

export type Db = ReturnType<typeof Db>;
