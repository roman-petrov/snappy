/* eslint-disable functional/no-expression-statements */
import type { Config } from "@snappy/config";

import { Db } from "@snappy/db";
import { Cron } from "@snappy/node";
import { Payment } from "@snappy/payment";
import { Snappy } from "@snappy/snappy";

import { Auth } from "./Auth";
import { SubscriptionRenewalCronJob } from "./cron-jobs";
import { PaymentLog } from "./PaymentLog";
import { Process } from "./Process";
import { Subscription } from "./Subscription";

export const ServerApp = ({
  dbUrl,
  freeRequestLimit,
  gigaChatAuthKey,
  jwtSecret,
  premiumPeriodDays,
  premiumPrice,
  yooKassaSecretKey,
  yooKassaShopId,
}: Config) => {
  const db = Db(dbUrl);
  const snappy = Snappy({ gigaChatAuthKey });
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

  const processModule = Process({
    freeRequestLimit,
    hasActiveSubscription: subscription.hasActiveSubscription,
    premiumPeriodDays,
    premiumPrice,
    snappy,
    snappySettings: db.snappySettings,
    subscription: db.subscription,
  });

  const api = { auth, process: processModule, subscription };
  const cron = Cron();
  cron.addJob(SubscriptionRenewalCronJob(subscription));

  return { api };
};

export type ServerApp = ReturnType<typeof ServerApp>;

export type ServerAppApi = ReturnType<typeof ServerApp>[`api`];
