import { Ai } from "@snappy/ai";
import { Config } from "@snappy/config";
import { Db } from "@snappy/db";
import { Payment } from "@snappy/payment";

import { Balance } from "./Balance";
import { BalancePayment } from "./BalancePayment";
import { BetterAuth } from "./BetterAuth";
import { PaymentLog } from "./PaymentLog";
import { UserSettings } from "./UserSettings";

export const ServerApp = async () => {
  const db = Db(Config.dbUrl);
  const betterAuth = BetterAuth({ prisma: db.prisma });

  const payment = Payment({
    credentials: { secretKey: Config.yooKassaSecretKey, shopId: Config.yooKassaShopId },
    type: `yoo-kassa`,
  });

  const paymentLog = PaymentLog(db.paymentLog);
  const balance = Balance({ balanceMinRub: Config.balanceMinRub, userBalance: db.userBalance });

  const balancePayment = BalancePayment({
    balance,
    balancePaymentMaxRub: Config.balancePaymentMaxRub,
    balancePaymentMinRub: Config.balancePaymentMinRub,
    payment,
    paymentLog,
  });

  const ai = await Ai({ aiTunnelKey: Config.aiTunnelKey, locale: `en` });
  const userSettings = UserSettings({ ai, userSettings: db.userSettings });

  return { balance, balancePayment, betterAuth, db, userSettings };
};

export type ServerApp = Awaited<ReturnType<typeof ServerApp>>;
