import { PrismaPg } from "@prisma/adapter-pg";

import { DbAgentSession } from "./DbAgentSession";
import { DbPaymentLog } from "./DbPaymentLog";
import { DbSnappySettings } from "./DbSnappySettings";
import { DbStoredFile } from "./DbStoredFile";
import { DbSubscription } from "./DbSubscription";
import { DbUser } from "./DbUser";
import { PrismaClient } from "./generated/client";

export const Db = (connectionString: string) => {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  const user = DbUser(prisma);
  const subscription = DbSubscription(prisma);
  const paymentLog = DbPaymentLog(prisma);
  const agentSession = DbAgentSession(prisma);
  const snappySettings = DbSnappySettings(prisma);
  const storedFile = DbStoredFile(prisma);

  return { agentSession, paymentLog, snappySettings, storedFile, subscription, user };
};

export type Db = ReturnType<typeof Db>;
