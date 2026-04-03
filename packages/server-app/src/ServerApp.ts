// cspell:word dall-e

import type { Config } from "@snappy/config";

import { Ai } from "@snappy/ai";
import { Db } from "@snappy/db";
import { Payment } from "@snappy/payment";

import { Auth } from "./Auth";
import { Balance } from "./Balance";
import { BalanceInfo } from "./BalanceInfo";
import { BalancePayment } from "./BalancePayment";
import { LlmProxy } from "./LlmProxy";
import { PaymentLog } from "./PaymentLog";
import { UserSettings } from "./UserSettings";

export const ServerApp = ({
  balanceMinRub,
  balancePaymentMaxRub,
  balancePaymentMinRub,
  dbUrl,
  jwtSecret,
  llmDebitPriceMultiplier,
  proxyApiKey,
  yooKassaSecretKey,
  yooKassaShopId,
}: Config) => {
  const db = Db(dbUrl);
  const payment = Payment({ credentials: { secretKey: yooKassaSecretKey, shopId: yooKassaShopId }, type: `yoo-kassa` });
  const auth = Auth({ jwtSecret, user: db.user });
  const paymentLog = PaymentLog(db.paymentLog);
  const balance = Balance({ balance: db.balance, balanceMinRub });
  const balancePayment = BalancePayment({ balance, balancePaymentMaxRub, balancePaymentMinRub, payment, paymentLog });
  const balanceInfo = BalanceInfo({ balance });
  const ai = Ai(proxyApiKey, llmDebitPriceMultiplier);
  const llm = LlmProxy({ ai, balance });
  const userLlmSettings = UserSettings({ ai, userSettings: db.userSettings });

  return { auth, balance: balanceInfo, balancePayment, llm, userLlmSettings };
};

export type ServerApp = ReturnType<typeof ServerApp>;

export type ServerAppApi = ReturnType<typeof ServerApp>;
