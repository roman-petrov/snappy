import { PrismaPg } from "@prisma/adapter-pg";

import { DbPaymentLog } from "./DbPaymentLog";
import { DbUser } from "./DbUser";
import { PrismaClient } from "./generated/client";

export const Db = (connectionString: string) => {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  const paymentLog = DbPaymentLog(prisma);
  const user = DbUser(prisma);

  return { paymentLog, prisma, user };
};

export type Db = ReturnType<typeof Db>;
