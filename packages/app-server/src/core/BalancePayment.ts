/* eslint-disable unicorn/try-complexity */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { Db, DbUser } from "@snappy/db";
import type { PaymentProvider, PaymentSnapshotSuccess } from "@snappy/payment";

import { Config, ConfigValues } from "@snappy/config";
import { _ } from "@snappy/core";
import { z } from "zod";

import type { Balance } from "./Balance";
import type { PaymentLog } from "./PaymentLog";

import { AppLog } from "./AppLog";
import { RpcScope } from "./RpcContract";
import { Session } from "./Session";

export type BalancePaymentConfig = { balance: Balance; db: Db; payment: PaymentProvider; paymentLog: PaymentLog };

export const BalancePayment = ({ balance, db, payment, paymentLog }: BalancePaymentConfig) => {
  const { query } = RpcScope;

  const reject = async (log: AppLog, user: DbUser | undefined, paymentId: string, reason: string) => {
    log.payment.warn(`payment.settle.rejected`, { paymentId, reason });
    await paymentLog.topUpSettleError(user, paymentId, reason);
  };

  const settle = async ({ metadataKind, money, paymentId, userId }: PaymentSnapshotSuccess) => {
    const log = AppLog({ userId });

    if (await paymentLog.succeeded(paymentId)) {
      log.payment.info(`payment.settle.already-succeeded`, { paymentId });

      return `ok` as const;
    }

    const user = Session.dbUserFromId(db, userId);
    if (metadataKind !== `topup`) {
      await reject(log, user, paymentId, `invalid-metadata`);

      return `rejected` as const;
    }
    if (user === undefined) {
      await reject(log, user, paymentId, `missing-user`);

      return `rejected` as const;
    }

    const amount = Number(money?.value);
    if (!Number.isFinite(amount) || amount <= 0) {
      await reject(log, user, paymentId, `invalid-amount`);

      return `rejected` as const;
    }

    const pending = await paymentLog.pendingAmount(paymentId);
    if (pending === undefined) {
      await reject(log, user, paymentId, `missing-pending`);

      return `rejected` as const;
    }
    if (_.round(pending, 2) !== _.round(amount, 2)) {
      await reject(log, user, paymentId, `amount-mismatch:${pending}:${amount}`);

      return `rejected` as const;
    }

    const credit = { amount, paymentId };
    try {
      await balance.creditFromTopUp(user, amount, { amount: money?.value, currency: money?.currency, paymentId });
      log.payment.info(`payment.credit.succeeded`, credit);
    } catch {
      log.payment.error(`payment.credit.failed`, credit);

      return `retry` as const;
    }

    return `ok` as const;
  };

  const redirect = async (user: DbUser, amount: number, culture?: `en` | `ru`, email?: string, log?: AppLog) => {
    const appLog = log ?? AppLog({ email, userId: user.id });
    if (!Number.isFinite(amount) || amount < Config.balance.paymentMin || amount > Config.balance.paymentMax) {
      appLog.payment.warn(`payment.url.invalid-amount`, { amount });

      return { status: `invalidAmount` as const };
    }
    const rounded = _.round(amount, 2);
    const origin = ConfigValues.origin(ConfigValues.env());
    const fields = { amount: rounded };

    const result = await payment.createRedirectPayment({
      amount: rounded,
      culture,
      description: `Snappy — пополнение баланса`,
      email,
      metadataKind: `topup`,
      options: {
        failUrl: `${origin}/app/billing/robokassa/fail`,
        returnUrl: `${origin}/app/billing/robokassa/success`,
      },
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
      culture,
      env: ConfigValues.env(),
      paymentId: result.paymentId,
      returnUrlMode: `override`,
    });

    return { paymentId: result.paymentId, status: `ok` as const, url: result.redirectUrl };
  };

  const status = async (userId: string, paymentId: string) => {
    const logged = await paymentLog.succeededAmount(paymentId, userId);
    if (logged !== undefined) {
      return { amount: logged, status: `succeeded` as const };
    }

    const result = await payment.payment(paymentId);
    if (!result.ok) {
      return { status: `pending` as const };
    }

    const parsed = Number(result.money?.value);
    const amount = Number.isFinite(parsed) ? parsed : undefined;
    if (result.userId === undefined || result.userId !== userId) {
      return { status: `error` as const };
    }
    if (result.status === `canceled`) {
      return { amount, status: `canceled` as const };
    }
    if (result.status !== `succeeded`) {
      return { amount: undefined, status: `pending` as const };
    }
    if (result.metadataKind !== `topup`) {
      return { amount, status: `pending` as const };
    }

    const outcome = await settle(result);
    if (outcome === `ok`) {
      return { amount, status: `succeeded` as const };
    }

    return { amount, status: outcome === `rejected` ? (`error` as const) : (`pending` as const) };
  };

  const webhook = async (body: unknown) => {
    const parsed = payment.parseWebhook(body);
    if (!parsed.ok) {
      AppLog().payment.warn(`robokassa.webhook.parse-failed`, { code: parsed.code });

      return undefined;
    }

    const result = await payment.payment(parsed.paymentId);
    if (!result.ok || result.status !== `succeeded`) {
      AppLog().payment.warn(`payment.settle.provider-not-succeeded`, {
        code: result.ok ? undefined : result.code,
        ok: result.ok,
        paymentId: parsed.paymentId,
        status: result.ok ? result.status : undefined,
      });

      return undefined;
    }

    return (await settle(result)) === `retry` ? undefined : `OK${parsed.paymentId}`;
  };

  const paymentStatusQuery = query(z.object({ paymentId: z.string() }), async ({ dbUser, input }) =>
    status(dbUser.id, input.paymentId),
  );

  const paymentUrlQuery = query(
    z.object({ amount: z.number().optional(), culture: z.enum([`en`, `ru`]).optional() }),
    async ({ dbUser, email, input, log }) => redirect(dbUser, input.amount ?? 0, input.culture, email, log),
  );

  const rpc = { paymentStatus: paymentStatusQuery, paymentUrl: paymentUrlQuery };
  const paymentStatus = status;
  const paymentUrl = redirect;

  return { paymentStatus, paymentUrl, rpc, webhook };
};

export type BalancePayment = ReturnType<typeof BalancePayment>;
