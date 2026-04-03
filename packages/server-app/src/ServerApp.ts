/* eslint-disable functional/no-expression-statements */
import type { Config } from "@snappy/config";

import { Db } from "@snappy/db";
import { Cron } from "@snappy/node";
import { Payment } from "@snappy/payment";

import { ServerAgent } from "./agent/ServerAgent";
import { Auth } from "./Auth";
import { bridgeRegistry } from "./BridgeRegistry";
import { SubscriptionRenewalCronJob } from "./cron-jobs";
import { Files } from "./Files";
import { FileStorage } from "./FileStorage";
import { Limits } from "./Limits";
import { PaymentLog } from "./PaymentLog";
import { Presets } from "./Presets";
import { Subscription } from "./Subscription";
import { UserSettings } from "./UserSettings";

export const ServerApp = ({
  dbUrl,
  filesStorageRoot,
  freeRequestLimit,
  jwtSecret,
  premiumPeriodDays,
  premiumPrice,
  yooKassaSecretKey,
  yooKassaShopId,
}: Config) => {
  const db = Db(dbUrl);
  const fileStorage = FileStorage(filesStorageRoot);
  const payment = Payment({ credentials: { secretKey: yooKassaSecretKey, shopId: yooKassaShopId }, type: `yoo-kassa` });
  const auth = Auth({ jwtSecret, user: db.user });
  const paymentLog = PaymentLog(db.paymentLog);

  const subscription = Subscription({
    freeRequestLimit,
    payment,
    paymentLog,
    premiumPeriodDays,
    premiumPrice,
    subscription: db.subscription,
  });

  const limits = Limits({
    freeRequestLimit,
    premiumPeriodDays,
    premiumPrice,
    snappySettings: db.snappySettings,
    subscription: db.subscription,
  });

  const bridge = bridgeRegistry();

  const agent = ServerAgent({
    agentSession: db.agentSession,
    bridge,
    fileStorage,
    freeRequestLimit,
    hasActiveSubscription: subscription.hasActiveSubscription,
    snappySettings: db.snappySettings,
    storedFile: db.storedFile,
  });

  const userSettings = UserSettings({ snappySettings: db.snappySettings });
  const files = Files({ fileStorage, storedFile: db.storedFile });
  const presets = Presets();

  const communityModels = { list: () => ({ ...bridge.listCommunityCatalog(), status: `ok` as const }) };

  const api = {
    agent: { ...agent, remaining: limits.remaining },
    auth,
    bridge,
    communityModels,
    files,
    presets,
    subscription,
    userSettings,
  };

  const cron = Cron();
  cron.addJob(SubscriptionRenewalCronJob(subscription));

  return { api };
};

export type ServerApp = ReturnType<typeof ServerApp>;

export type ServerAppApi = ReturnType<typeof ServerApp>[`api`];
