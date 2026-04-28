// cspell:word dall-e

import type { Config } from "@snappy/config";

import { Ai } from "@snappy/ai";
import { Db } from "@snappy/db";
import { Payment } from "@snappy/payment";

import { AiTunnelProxy } from "./AiTunnelProxy";
import { Balance } from "./Balance";
import { BalancePayment } from "./BalancePayment";
import { BetterAuth } from "./BetterAuth";
import { PaymentLog } from "./PaymentLog";
import { UserSettings } from "./UserSettings";

export const ServerApp = async ({
  aiTunnelKey,
  balanceMinRub,
  balancePaymentMaxRub,
  balancePaymentMinRub,
  dbUrl,
  yooKassaSecretKey,
  yooKassaShopId,
}: Config) => {
  const db = Db(dbUrl);
  const betterAuth = BetterAuth({ prisma: db.prisma });
  const payment = Payment({ credentials: { secretKey: yooKassaSecretKey, shopId: yooKassaShopId }, type: `yoo-kassa` });
  const paymentLog = PaymentLog(db.paymentLog);
  const balance = Balance({ balanceMinRub, userBalance: db.userBalance });
  const balancePayment = BalancePayment({ balance, balancePaymentMaxRub, balancePaymentMinRub, payment, paymentLog });
  const ai = await Ai({ aiTunnelKey, locale: `en` });
  const aiTunnelProxy = AiTunnelProxy({ aiTunnelKey, balance });
  const userSettings = UserSettings({ ai, userSettings: db.userSettings });

  return { aiTunnelProxy, balance, balancePayment, betterAuth, db, userSettings };
};

export type ServerApp = Awaited<ReturnType<typeof ServerApp>>;
