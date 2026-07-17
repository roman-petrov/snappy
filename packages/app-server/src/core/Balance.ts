/* eslint-disable functional/no-expression-statements */
import type { DbUser } from "@snappy/db";

import { Config } from "@snappy/config";
import { _ } from "@snappy/core";

import { AppTrpcAuth } from "./AppTrpc";

const read = async (user: DbUser) => user.balance.read();
const isLlmBlocked = async (user: DbUser) => (await read(user)) <= 0;

const creditFromTopUp = async (
  user: DbUser,
  amountRub: number,
  log: { amount?: number | string; currency?: string; paymentId: string },
) => user.balance.creditTopUp(amountRub, { ...log, type: `topup` });

const creditFromSignUp = async (user: DbUser) =>
  user.balance.credit(Config.balance.signUpBonusRub, { source: `signUp` });

const debitForLlm = async (user: DbUser, costRub: number, meta: { call: string; model: string }) => {
  const rub = _.round(costRub * (1 + Config.balance.llmCommission), 2);
  await user.balance.debit(rub, { ...meta, chargedRub: rub, costRub });
};

const trpc = AppTrpcAuth.query(async ({ ctx }) => read(ctx.dbUser));

export const Balance = { creditFromSignUp, creditFromTopUp, debitForLlm, isLlmBlocked, read, trpc };

export type Balance = typeof Balance;
