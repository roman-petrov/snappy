/* eslint-disable unicorn/try-complexity */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { Db, DbUser } from "@snappy/db";
import type { PaymentProvider } from "@snappy/payment";

import { Config, ConfigValues } from "@snappy/config";
import { _ } from "@snappy/core";
import { z } from "zod";

import type { Balance } from "./Balance";
import type { PaymentLog } from "./PaymentLog";

import { AppLog } from "./AppLog";
import { RpcScope } from "./RpcContract";
import { Session } from "./Session";

export type BalancePaymentConfig = {
  balance: Balance;
  db: ReturnType<typeof Db>;
  payment: PaymentProvider;
  paymentLog: PaymentLog;
};

export const BalancePayment = ({ balance, db, payment, paymentLog }: BalancePaymentConfig) => {
  const paymentUrl = async (user: DbUser, amount: number, log?: AppLog) => {
    const appLog = log ?? AppLog({ userId: user.id });
    if (!Number.isFinite(amount) || amount < Config.balance.paymentMinRub || amount > Config.balance.paymentMaxRub) {
      appLog.payment.warn(`payment.url.invalid-amount`, { amount });

      return { status: `invalidAmount` as const };
    }
    const rounded = _.round(amount, 2);
    const origin = ConfigValues.origin(ConfigValues.env());
    const fields = { amount: rounded };

    const result = await payment.createRedirectPayment({
      amount: rounded,
      description: `Snappy — пополнение баланса`,
      metadataKind: `topup`,
      options: ConfigValues.production()
        ? undefined
        : { failUrl: `${origin}/billing/robokassa/fail`, returnUrl: `${origin}/billing/robokassa/success` },
      userId: user.id,
    });

    if (!result.ok) {
      appLog.payment.error(`payment.url.provider-error`, {
        ...fields,
        code: result.code,
        externalMessage: result.externalMessage,
      });
      await paymentLog.topUpError(user, result.code, result.externalMessage);

      return { status: `paymentError` as const };
    }

    await paymentLog.topUpPending(user, result.paymentId, rounded);
    appLog.payment.info(`payment.url.created`, {
      ...fields,
      env: ConfigValues.env(),
      paymentId: result.paymentId,
      returnUrlMode: ConfigValues.production() ? `cabinet` : `override`,
    });

    return { status: `ok` as const, url: result.redirectUrl };
  };

  const reject = async (log: AppLog, user: DbUser | undefined, paymentId: string, reason: string) => {
    log.payment.warn(`payment.settle.rejected`, { paymentId, reason });
    await paymentLog.topUpSettleError(user, paymentId, reason);

    return true;
  };

  const handlePaymentSucceeded = async (paymentId: string) => {
    const result = await payment.payment(paymentId);
    if (!result.ok || result.status !== `succeeded`) {
      AppLog().payment.warn(`payment.settle.provider-not-succeeded`, {
        code: result.ok ? undefined : result.code,
        ok: result.ok,
        paymentId,
        status: result.ok ? result.status : undefined,
      });

      return false;
    }
    const { metadataKind, money, userId } = result;
    const profile = userId === undefined ? undefined : await db.users.read(userId);
    const log = AppLog({ email: profile?.email, userId });

    if (await paymentLog.succeeded(paymentId)) {
      log.payment.info(`payment.settle.already-succeeded`, { paymentId });

      return true;
    }

    const user = Session.dbUserFromId(db, userId);
    if (metadataKind !== `topup`) {
      return reject(log, user, paymentId, `invalid-metadata`);
    }
    if (user === undefined) {
      return reject(log, user, paymentId, `missing-user`);
    }

    const amountRub = Number(money?.value);
    if (!Number.isFinite(amountRub) || amountRub <= 0) {
      return reject(log, user, paymentId, `invalid-amount`);
    }

    const pending = await paymentLog.pendingAmount(paymentId);
    if (pending === undefined) {
      return reject(log, user, paymentId, `missing-pending`);
    }
    if (_.round(pending, 2) !== _.round(amountRub, 2)) {
      return reject(log, user, paymentId, `amount-mismatch:${pending}:${amountRub}`);
    }

    const credit = { amountRub, paymentId };
    try {
      await balance.creditFromTopUp(user, amountRub, { amount: money?.value, currency: money?.currency, paymentId });
      log.payment.info(`payment.credit.succeeded`, credit);
    } catch {
      log.payment.error(`payment.credit.failed`, credit);

      return false;
    }

    return true;
  };

  const webhook = async (body: unknown) => {
    const parsed = payment.parseWebhook(body);
    if (!parsed.ok) {
      AppLog().payment.warn(`robokassa.webhook.parse-failed`, { code: parsed.code });

      return undefined;
    }

    return (await handlePaymentSucceeded(parsed.paymentId)) ? `OK${parsed.paymentId}` : undefined;
  };

  const rpc = {
    paymentUrl: RpcScope.query(z.object({ amount: z.number().optional() }), async ({ dbUser, input, log }) =>
      paymentUrl(dbUser, input.amount ?? 0, log),
    ),
  };

  return { paymentUrl, rpc, webhook };
};

export type BalancePayment = ReturnType<typeof BalancePayment>;
